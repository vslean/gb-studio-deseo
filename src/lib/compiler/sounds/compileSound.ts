import { assetFilename } from "lib/helpers/gbstudio";
import { Sound } from "store/features/entities/entitiesTypes";
import { compileVGM, compileVGMHeader } from "./compileVGM";
import { compileWav, compileWavHeader } from "./compileWav";

interface CompileSoundOptions {
  projectRoot: string;
}

export const compileSound = (
  sound: Sound,
  { projectRoot }: CompileSoundOptions
): Promise<string> => {
  const assetPath = assetFilename(projectRoot, "sounds", sound);

  if (sound.type === "wav") {
    return compileWav(assetPath, sound.symbol);
  } else if (sound.type === "vgm") {
    return compileVGM(assetPath, sound.symbol);
  }

  return Promise.resolve("// Unknown sound file");
};

export const compileSoundHeader = (sound: Sound) => {
  if (sound.type === "wav") {
    return compileWavHeader(sound.symbol);
  } else if (sound.type === "vgm") {
    return compileVGMHeader(sound.symbol);
  }

  return Promise.resolve("// Unknown sound file");
};
