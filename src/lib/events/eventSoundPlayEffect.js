const l10n = require("../helpers/l10n").default;

const id = "EVENT_SOUND_PLAY_EFFECT";
const groups = ["EVENT_GROUP_MUSIC"];

const fields = [
  {
    key: "type",
    type: "soundEffect",
    defaultValue: "beep",
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
    min: 0,
    max: 4.25,
    step: 0.01,
    defaultValue: 0.5,
  },
  {
    key: "wait",
    type: "checkbox",
    label: l10n("FIELD_WAIT_UNTIL_FINISHED"),
    defaultValue: true,
  },
  {
    key: "swp_time",
    type: "number",
    label: "Swp Time",
    conditions: [
      {
        key: "type",
        eq: "sweep",
      },
    ],
    min: 0,
    max: 7,
    step: 1,
    defaultValue: 0,
  },
  {
    key: "swp_mode",
    type: "number",
    label: "Swp Mode",
    conditions: [
      {
        key: "type",
        eq: "sweep",
      },
    ],
    min: 0,
    max: 1,
    step: 1,
    defaultValue: 0,
  },
  {
    key: "swp_shifts",
    type: "number",
    label: "Swp Shifts",
    conditions: [
      {
        key: "type",
        eq: "sweep",
      },
    ],
    min: 0,
    max: 7,
    step: 1,
    defaultValue: 0,
  },
  {
    key: "pat_duty",
    type: "number",
    label: "Pat Duty",
    conditions: [
      {
        key: "type",
        eq: "sweep",
      },
    ],
    min: 0,
    max: 3,
    step: 1,
    defaultValue: 0,
  },
  {
    key: "len",
    type: "number",
    label: "Sound Len",
    conditions: [
      {
        key: "type",
        eq: "sweep",
      },
    ],
    min: 0,
    max: 63,
    step: 1,
    defaultValue: 0,
  },
  {
    key: "env_init",
    type: "number",
    label: "Env Init",
    conditions: [
      {
        key: "type",
        eq: "sweep",
      },
    ],
    min: 0,
    max: 15,
    step: 1,
    defaultValue: 0,
  },
  {
    key: "env_mode",
    type: "number",
    label: "Env Mode",
    conditions: [
      {
        key: "type",
        eq: "sweep",
      },
    ],
    min: 0,
    max: 1,
    step: 1,
    defaultValue: 0,
  },
  {
    key: "env_nb_swp",
    type: "number",
    label: "Env Nb Swp",
    conditions: [
      {
        key: "type",
        eq: "sweep",
      },
    ],
    min: 0,
    max: 7,
    step: 1,
    defaultValue: 0,
  },
  {
    key: "freq",
    type: "number",
    label: "Frequency",
    conditions: [
      {
        key: "type",
        eq: "sweep",
      },
    ],
    min: 0,
    max: 2047,
    step: 1,
    defaultValue: 0,
  },
  {
    key: "cons_sel",
    type: "number",
    label: "Cons Sel",
    conditions: [
      {
        key: "type",
        eq: "sweep",
      },
    ],
    min: 0,
    max: 1,
    step: 1,
    defaultValue: 0,
  }
];

const compile = (input, helpers) => {
  const { soundPlayBeep, soundStartTone, soundStartSweep, soundPlayCrash, wait } = helpers;

  let seconds = typeof input.duration === "number" ? input.duration : 0.5;

  if (input.type === "beep" || !input.type) {
    const pitch = typeof input.pitch === "number" ? input.pitch : 4;
    soundPlayBeep(9 - pitch);
  } else if (input.type === "tone") {
    const freq = typeof input.frequency === "number" ? input.frequency : 200;
    let period = (2048 - 131072 / freq + 0.5) | 0;
    if (period >= 2048) {
      period = 2047;
    }
    if (period < 0) {
      period = 0;
    }
    const toneFrames = Math.min(255, Math.ceil(seconds * 60));
    soundStartTone(period, toneFrames);
  } else if (input.type === "crash") {
    soundPlayCrash();
  } else if(input.type=== "sweep"){
    const toneFrames = Math.min(255, Math.ceil(seconds * 60));
    soundStartSweep(input.swp_time,input.swp_mode,input.swp_shifts,input.pat_duty,input.len,input.env_init,input.env_mode,input.env_nb_swp,input.freq,input.cons_sel, toneFrames);
  }

  // Convert seconds into frames (60fps)
  if (input.wait) {
    while (seconds > 0) {
      const time = Math.min(seconds, 1);
      wait(Math.ceil(60 * time));
      seconds -= time;
    }
  }
};

module.exports = {
  id,
  groups,
  fields,
  compile,
};
