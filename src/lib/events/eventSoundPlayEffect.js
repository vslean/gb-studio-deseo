const l10n = require("../helpers/l10n").default;

const id = "EVENT_SOUND_PLAY_EFFECT";
const groups = ["EVENT_GROUP_MUSIC"];

const fields = [
  {
    key: "type",
    type: "soundEffect",
    label: l10n("FIELD_SOUND_EFFECT"),
    defaultValue: "beep",
    flexBasis: "100%",
  },
  {
    key: "pitch",
    type: "number",
    label: l10n("FIELD_PITCH"),
    conditions: [
      {
        key: "type",
        eq: "beep",
      },
    ],
    min: 1,
    max: 8,
    step: 1,
    defaultValue: 4,
  },
  {
    key: "frequency",
    type: "number",
    label: l10n("FIELD_FREQUENCY"),
    conditions: [
      {
        key: "type",
        eq: "tone",
      },
    ],
    min: 0,
    max: 20000,
    step: 1,
    defaultValue: 200,
  },
  {
    key: "duration",
    type: "number",
    label: l10n("FIELD_DURATION"),
    conditions: [
      {
        key: "type",
        in: ["beep", "crash", "tone"],
      },
    ],
    min: 0,
    max: 4.25,
    step: 0.01,
    defaultValue: 0.5,
  },
  {
    key: "wait",
    type: "checkbox",
    label: l10n("FIELD_WAIT_UNTIL_FINISHED"),
    conditions: [
      {
        key: "type",
        in: ["beep", "crash", "tone"],
      },
    ],
    defaultValue: true,
    flexBasis: "100%",
  },
];

const compile = (input, helpers) => {
  const {
    soundPlayBeep,
    soundStartTone,
    soundPlayCrash,
    soundPlay,
    wait,
    writeAsset,
    appendRaw,
  } = helpers;

  soundPlay(input.type);

  // let seconds = typeof input.duration === "number" ? input.duration : 0.5;

  // if (input.type === "beep" || !input.type) {
  //   const pitch = typeof input.pitch === "number" ? input.pitch : 4;
  //   soundPlayBeep(9 - pitch);
  // } else if (input.type === "tone") {
  //   const freq = typeof input.frequency === "number" ? input.frequency : 200;
  //   let period = (2048 - 131072 / freq + 0.5) | 0;
  //   if (period >= 2048) {
  //     period = 2047;
  //   }
  //   if (period < 0) {
  //     period = 0;
  //   }
  //   const toneFrames = Math.min(255, Math.ceil(seconds * 60));
  //   soundStartTone(period, toneFrames);
  // } else if (input.type === "crash") {
  //   soundPlayCrash();
  // }

  // // Convert seconds into frames (60fps)
  // if (input.wait) {
  //   while (seconds > 0) {
  //     const time = Math.min(seconds, 1);
  //     wait(Math.ceil(60 * time));
  //     seconds -= time;
  //   }
  // }

  // appendRaw(
  //   `VM_SFX_PLAY             ___bank_sound_wave_icq_message, _sound_wave_icq_message, ___mute_mask_sound_wave_icq_message`
  // );

  // writeAsset(
  //   "sound_effect1.c",
  //   `#pragma bank 255

  // #include <gbdk/platform.h>
  // #include <stdint.h>

  // BANKREF(sound_effect1)
  // const uint8_t sound_effect1[] = {
  //   // 1, 0b11111001, 0x00, 0x01, 0xF0, 0x5C, 0x87,
  // 0x71, 0b11111000, 0x4c,0x81,0x43,0x73,0x86,//play for 2 frames
  // 0x01, 0b00101000, 0x00,0xc0               ,//shut ch1
  // // 0x01, 0b00000111                          ,//stop
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,
  //   0x30,

  //   0x71, 0b11111000, 0x00, 0x01, 0xF0, 0x5C, 0x87,  // play for 2 frames
  // 0x30,
  // 0x30,
  // 0x30,
  // 0x30,
  // 0x30,
  // 0x30,
  // 0x30,
  // 0x30,

  //  0x01, 0b00101000, 0x00,0xc0,                 // shut ch1
  //  0x01, 0b00000111,                            // stop

  //   // 1, 0b11111001, 0x00, 0x01, 0xF0, 0x71, 0x85,
  //   // 1, 0b11111000, 0x16, 0x4A, 0xB7, 0xFE, 0x85,    // frame0
  //   // 0,                                              // frame1
  //   // 1, 0b11111000, 0x16, 0x4A, 0xB7, 0xFE, 0x85     // frame2
  //   // 0x32, 0b01111000, 0x00, 0x01, 0xF0, 0x71, 0x85
  // // 0x32,0b11111000,0x00,0xbf,0xf3,0x5b,0x86,0b01111011,0x3f,0xf1,0x44,0x80,
  // // 0x30,
  // // 0x31,0b01111000,0xbf,0x87,0x5b,0x86,
  // // 0x30,
  // // 0x30,
  // // 0x31,0b01111000,0xbf,0xf3,0xc4,0x86,
  // // 0x30,
  // // 0x31,0b01111000,0xbf,0x87,0x5b,0x86,
  // // 0x30,
  // // 0x30,
  // // 0x31,0b01111000,0xbf,0xf3,0xe7,0x86,
  // // 0x30,
  // // 0x31,0b01111000,0xbf,0x87,0xc4,0x86,
  // // 0x30,
  // // 0x30,
  // // 0x31,0b01111000,0xbf,0xf3,0x2d,0x87,
  // // 0x30,
  // // 0x31,0b01111000,0xbf,0x87,0xe7,0x86,
  // // 0x30,
  // // 0x30,
  // // 0x31,0b01111000,0xbf,0xa3,0x5b,0x86,
  // // 0x30,
  // // 0x31,0b01111000,0xbf,0x63,0x2d,0x87,
  // // 0x30,
  // // 0x30,
  // // 0x31,0b01111000,0xbf,0xa3,0xc4,0x86,
  // // 0x30,
  // // 0x31,0b01111000,0xbf,0x63,0x5b,0x86,
  // // 0x30,
  // // 0x30,
  // // 0x31,0b01111000,0xbf,0xa3,0xe7,0x86,
  // // 0x30,
  // // 0x31,0b01111000,0xbf,0x63,0xc4,0x86,
  // // 0x30,
  // // 0x30,
  // // 0x31,0b01111000,0xbf,0xa3,0x2d,0x87,
  // // 0x30,
  // // 0x31,0b01111000,0xbf,0x63,0xe7,0x86,
  // // 0x30,
  // // 0x30,
  // // 0x31,0b01111000,0xbf,0x53,0x5b,0x86,
  // // 0x30,
  // // 0x31,0b01111000,0xbf,0x33,0x2d,0x87,
  // // 0x30,
  // // 0x30,
  // // 0x31,0b01111000,0xbf,0x53,0xc4,0x86,
  // // 0x30,
  // // 0x31,0b01111000,0xbf,0x33,0x5b,0x86,
  // // 0x30,
  // // 0x30,
  // // 0x31,0b01111000,0xbf,0x53,0xe7,0x86,
  // // 0x30,
  // // 0x31,0b01111000,0xbf,0x33,0xc4,0x86,
  // // 0x30,
  // // 0x30,
  // // 0x31,0b01111000,0xbf,0x53,0x2d,0x87,
  // // 0x30,
  // // 0x31,0b01111000,0xbf,0x33,0xe7,0x86,
  // // 0x30,
  // // 0x30,
  // // 0x30,
  // // 1,0b00000111
  // };
  // void AT(0b00000001) __mute_mask_sound_effect1;`
  // );
};

module.exports = {
  id,
  groups,
  fields,
  compile,
};
