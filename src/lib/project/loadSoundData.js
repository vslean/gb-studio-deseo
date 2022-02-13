import glob from "glob";
import { promisify } from "util";
import uuidv4 from "uuid/v4";
import { stat } from "fs-extra";
import parseAssetPath from "../helpers/path/parseAssetPath";
import { toValidSymbol } from "lib/helpers/symbols";

const globAsync = promisify(glob);

const loadSoundData = (projectRoot) => async (filename) => {
  const { file, plugin } = parseAssetPath(filename, projectRoot, "sounds");
  const fileStat = await stat(filename, { bigint: true });
  const inode = fileStat.ino.toString();
  const name = file.replace(/(.vgm|.wav)/i, "");
  return {
    id: uuidv4(),
    plugin,
    name,
    symbol: toValidSymbol(`sound_${name}`),
    filename: file,
    type: file.endsWith(".wav") ? "wav" : "vgm",
    inode,
    _v: Date.now(),
  };
};

const loadAllSoundData = async (projectRoot) => {
  const soundPaths = await globAsync(
    `${projectRoot}/assets/sounds/**/@(*.vgm|*.VGM|*.wav|*.WAV)`
  );
  const pluginPaths = await globAsync(
    `${projectRoot}/plugins/*/sounds/**/@(*.vgm|*.VGM|*.wav|*.WAV)`
  );
  const soundsData = await Promise.all(
    [].concat(
      soundPaths.map(loadSoundData(projectRoot)),
      pluginPaths.map(loadSoundData(projectRoot))
    )
  );
  return soundsData;
};

export default loadAllSoundData;
export { loadSoundData };
