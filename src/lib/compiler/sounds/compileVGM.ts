export const compileVGM = (
  filename: string,
  symbol: string
): Promise<string> => {
  return Promise.resolve("");
};

export const compileVGMHeader = (symbol: string) => {
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
