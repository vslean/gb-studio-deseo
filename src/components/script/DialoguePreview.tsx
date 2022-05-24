import keyBy from "lodash/keyBy";
import uniq from "lodash/uniq";
import React, { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { assetFilename } from "lib/helpers/gbstudio";
import { textNumLines } from "lib/helpers/trimlines";
import { RootState } from "store/configureStore";
import {
  avatarSelectors,
  fontSelectors,
} from "store/features/entities/entitiesState";
import { loadFont, drawFrame, drawText, FontData } from "./TextPreviewHelper";

interface DialoguePreviewProps {
  text: string;
  avatarId?: string;
}

export const DialoguePreview: FC<DialoguePreviewProps> = ({
  text,
  avatarId,
}) => {
  const projectRoot = useSelector((state: RootState) => state.document.root);
  const uiVersion = useSelector((state: RootState) => state.editor.uiVersion);
  const avatarAsset = useSelector((state: RootState) =>
    avatarId ? avatarSelectors.selectById(state, avatarId) : undefined
  );
  const fonts = useSelector((state: RootState) =>
    fontSelectors.selectAll(state)
  );
  const fontsLookup = useSelector((state: RootState) =>
    fontSelectors.selectEntities(state)
  );
  const defaultFontId = useSelector(
    (state: RootState) =>
      state.project.present.settings.defaultFontId || fonts[0]?.id
  );

  const [frameImage, setFrameImage] = useState<HTMLImageElement>();
  const [avatarImage, setAvatarImage] = useState<HTMLCanvasElement>();
  const [fontsData, setFontsData] = useState<Record<string, FontData>>({});
  const [drawn, setDrawn] = useState<boolean>(false);
  const ref = useRef<HTMLCanvasElement>(null);

  const frameAsset = {
    id: "frame",
    name: "Window Frame",
    filename: `frame.png`,
    _v: uiVersion,
  };
  const ava1Asset = {
    id: "ava1",
    name: "Avatar 1",
    filename: `ava1.png`,
    _v: uiVersion,
  };
  const ava2Asset = {
    id: "ava2",
    name: "Avatar 2",
    filename: `ava2.png`,
    _v: uiVersion,
  };
  const ava3Asset = {
    id: "ava3",
    name: "Avatar 3",
    filename: `ava3.png`,
    _v: uiVersion,
  };

  const frameFilename = `file:///${assetFilename(
    projectRoot,
    "ui",
    frameAsset
  )}?_v=${uiVersion}`;
  const ava1Filename = `file:///${assetFilename(
    projectRoot,
    "customAvatars",
    ava1Asset
  )}?_v=${uiVersion}`;
  const ava2Filename = `file:///${assetFilename(
    projectRoot,
    "customAvatars",
    ava2Asset
  )}?_v=${uiVersion}`;
  const ava3Filename = `file:///${assetFilename(
    projectRoot,
    "customAvatars",
    ava3Asset
  )}?_v=${uiVersion}`;

  const avatarFilename = avatarAsset
    ? `file:///${assetFilename(projectRoot, "avatars", avatarAsset)}?_v=${
        avatarAsset._v || 0
      }`
    : "";

  useEffect(() => {
    async function fetchData() {
      const usedFontIds = uniq(
        ([] as string[]).concat(
          defaultFontId,
          (String(text).match(/(!F:[0-9a-f-]+!)/g) || []) // Add fonts referenced in text
            .map((id) => id.substring(3).replace(/!$/, ""))
        )
      );
      const usedFonts = usedFontIds.map((id) => fontsLookup[id] || fonts[0]);
      const usedFontData = await Promise.all(
        usedFonts.map((font) => loadFont(projectRoot, font))
      );
      setFontsData(keyBy(usedFontData, "id"));
    }
    fetchData();
  }, [text, defaultFontId, fonts, fontsLookup, projectRoot]);

  // Load frame image
  useEffect(() => {
    const img = new Image();
    img.src = frameFilename;
    img.onload = () => {
      setFrameImage(img);
    };
  }, [frameFilename]);

  // Load frame image
  useEffect(() => {
    const img = new Image();
    img.src = frameFilename;
    img.onload = () => {
      setFrameImage(img);
    };
  }, [frameFilename]);

  // Load Avatar image
  useEffect(() => {
    if (avatarFilename) {
      const img = new Image();
      img.src = avatarFilename;
      img.onload = () => {
        // Make green background color transparent
        const tmpCanvas = document.createElement("canvas");
        const tmpCtx = tmpCanvas.getContext("2d");
        if (!tmpCtx) {
          return;
        }
        tmpCtx.drawImage(img, 0, 0);
        const imgData = tmpCtx?.getImageData(0, 0, 16, 16);
        if (imgData) {
          for (let i = 0; i < imgData.data.length; i += 4) {
            const g = imgData.data[i + 1];
            const b = imgData.data[i + 2];
            const a = imgData.data[i + 3];
            if ((g > 250 && b < 100) || a < 10) {
              imgData.data[i + 3] = 0;
            }
          }
          tmpCtx.putImageData(imgData, 0, 0);
        }
        setAvatarImage(tmpCanvas);
      };
    } else {
      setAvatarImage(undefined);
    }
  }, [avatarFilename]);

  useLayoutEffect(() => {
    if (ref.current && frameImage && (!avatarId || avatarImage)) {
      const canvas = ref.current;
      const ctx = canvas.getContext("2d");
      // eslint-disable-next-line no-self-assign
      canvas.width = canvas.width;
      if (ctx) {
        const tileWidth = 20;
        const tileHeight = 6;
        canvas.width = tileWidth * 8;
        canvas.height = tileHeight * 8;
        drawFrame(ctx, frameImage, tileWidth, tileHeight);
        const img= new Image();
		const img2= new Image();
		if(text[0]=="4" || text[0]=="5" || text[0]=="6"){
			if(text[0]=="4"){
				img2.src=ava1Filename;
			}else if(text[0]=="5"){
				img2.src=ava2Filename;
			}else if(text[0]=="6"){
				img2.src=ava3Filename;
			}
		}
		text=text.replace("4","");
		text=text.replace("5","");
		text=text.replace("6","");
		if(text[0]=="1" || text[0]=="2" || text[0]=="3"){
			
			if(text[0]=="1"){
				img.src=ava1Filename;
			}else if(text[0]=="2"){
				img.src=ava2Filename;
			}else if(text[0]=="3"){
				img.src=ava3Filename;
			}
			
		}
		text=text.replace("1","");
		text=text.replace("2","");
		text=text.replace("3","");
		
		var pelado=text.replace("\r","");
		pelado=pelado.replace("\n","");
		if(pelado.length>49){
			text="¡ERROR!";
        } else {
			ctx.drawImage(img,8,8);
			ctx.drawImage(img2,120,8);
        }
		drawText(ctx, text, 40, 8, fontsData, defaultFontId, fonts[0]?.id);		
      }
      setDrawn(true);
    }
  }, [
    ref,
    text,
    avatarId,
    frameImage,
    avatarImage,
    fontsData,
    defaultFontId,
    fonts,
  ]);

  return (
    <canvas
      ref={ref}
      width={160}
      height={48}
      style={{
        width: 240,
        imageRendering: "pixelated",
        boxShadow: "5px 5px 10px 0px rgba(0,0,0,0.5)",
        borderRadius: 4,
        opacity: drawn ? 1 : 0,
      }}
    />
  );
};
