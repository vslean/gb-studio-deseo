import { readFile } from "fs-extra";
import { decHex } from "lib/helpers/8bit";
import { WaveFile } from "wavefile";

type WaveFileFmt = {
  numChannels: number;
  bitsPerSample: number;
  sampleRate: number;
};

export const compileWav = async (
  filename: string,
  symbol: string
): Promise<string> => {
  const file = await readFile(filename);

  console.log(filename, file);

  let wav = new WaveFile(file);
  console.log({ wav });

  let wavFmt = wav.fmt as WaveFileFmt;

  // const isUncompressed = (p.comptype == 'NONE')
  const isUncompressed = true;

  // Resample is sample rate is wrong
  if (wavFmt.sampleRate < 8000 || wavFmt.sampleRate > 8192) {
    console.log("RESAMPLE", wavFmt.sampleRate);
    wav.toSampleRate(8000);
    wavFmt = wav.fmt as WaveFileFmt;
  }

  if (
    // wavFmt.numChannels !== 1 ||
    // wavFmt.bitsPerSample !== 8 ||
    wavFmt.sampleRate < 8000 ||
    wavFmt.sampleRate > 8192 ||
    !isUncompressed
  ) {
    console.log(wavFmt);
    throw new Error("Unsupport wav");
  }

  let result = "";
  let output = "";
  //   const rawData: Float64Array = wav.getSamples(true);
  let data: Float64Array = wav.getSamples(false);
  //   console.log("typeof rawData", typeof rawData);
  //   console.log("rawData.length", rawData.length);
  if (wavFmt.numChannels > 1) {
    // console.log("MULTICHANNEL", data);
    // const newLength = Math.floor(data.length / wavFmt.numChannels);
    // console.log({ newLength });
    // const newData = new Float64Array(newLength);
    // for (let i = 0; i < newLength; i++) {
    //   //   newData[i] = Math.floor(Math.random() * 255);
    //   newData[i] = data[i * wavFmt.numChannels];
    //   console.log(`MAP ${i} TO ${i * wavFmt.numChannels}`);
    // }
    // data = newData;
    data = data[0] as unknown as Float64Array;
  }

  console.log(data);
  const dataLength = data.length - (data.length % 32);
  let c = 0;
  let cnt = 0;
  let flag = false;
  console.log({ dataLength });
  for (let i = 0; i < dataLength; i++) {
    // console.log(i, data[i]);
    c = ((c << 4) | (data[i] >> 4)) & 0xff;
    if (flag) {
      result += decHex(c); //sEMIT.format(c);
      cnt += 1;
      if (cnt % 16 === 0) {
        result = `1,0b00000110,${result},\n`;
        // outf.write(bytes(result, "ascii"));
        output += result;
        result = "";
      } else {
        result += ",";
      }
    }
    flag = !flag;
  }

  console.log({ output });

  return Promise.resolve(`#pragma bank 255

#include <gbdk/platform.h>
#include <stdint.h>

BANKREF(${symbol})
const UINT8 ${symbol}[] = {
${output}
1,0b00000111
};
void AT(0b00000100) __mute_mask_${symbol};
`);
};

export const compileWavHeader = (symbol: string) => {
  return `#ifndef __${symbol}_INCLUDE__
#define __${symbol}_INCLUDE__

#include <gbdk/platform.h>
#include <stdint.h>

#define MUTE_MASK_${symbol} 0b00000100

BANKREF_EXTERN(${symbol})
extern const uint8_t ${symbol}[];
extern void __mute_mask_${symbol};

#endif
`;
};
