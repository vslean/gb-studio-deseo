import React, { useCallback, useMemo } from "react";
import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";
import SpriteSheetCanvas from "./SpriteSheetCanvas";
import { MIDDLE_MOUSE } from "../../consts";
import { actorSelectors } from "store/features/entities/entitiesState";
import editorActions from "store/features/editor/editorActions";
import { RootState } from "store/configureStore";
import { Palette } from "store/features/entities/entitiesTypes";
import { mergePrefabActor } from "store/features/entities/entitiesHelpers";

interface ActorProps {
  sceneId: string;
  id: string;
  palettes: Palette[];
  editable: boolean;
}

const Actor = ({ id, sceneId, editable, palettes }: ActorProps) => {
  const dispatch = useDispatch();

  const selected = useSelector(
    (state: RootState) =>
      state.editor.type === "actor" &&
      state.editor.scene === sceneId &&
      state.editor.entityId === id
  );

  const showSprite = useSelector((state: RootState) => state.editor.zoom > 80);

  const originalActor = useSelector((state: RootState) =>
    actorSelectors.selectById(state, id)
  );

  const prefabActor = useSelector((state: RootState) =>
    originalActor?.prefabId
      ? actorSelectors.selectById(state, originalActor.prefabId)
      : undefined
  );

  const actor = useMemo(() => {
    return originalActor && mergePrefabActor(originalActor, prefabActor);
  }, [originalActor, prefabActor]);

  const onMouseUp = useCallback(
    (_e) => {
      dispatch(editorActions.dragActorStop());
      window.removeEventListener("mouseup", onMouseUp);
    },
    [dispatch]
  );

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (editable && originalActor && e.nativeEvent.which !== MIDDLE_MOUSE) {
        dispatch(
          editorActions.dragActorStart({ sceneId, actorId: originalActor.id })
        );
        dispatch(editorActions.setTool({ tool: "select" }));
        window.addEventListener("mouseup", onMouseUp);
      }
    },
    [originalActor, dispatch, editable, onMouseUp, sceneId]
  );

  if (!actor) {
    return <div />;
  }

  const { x, y, direction, spriteSheetId } = actor;

  return (
    <>
      {selected && actor.isPinned && <div className="Actor__ScreenPreview" />}
      <div
        className={cx("Actor", { "Actor--Selected": selected })}
        onMouseDown={onMouseDown}
        style={{
          top: y * 8,
          left: x * 8,
        }}
      >
        {showSprite && (
          <div style={{ pointerEvents: "none" }}>
            <SpriteSheetCanvas
              spriteSheetId={spriteSheetId}
              direction={direction}
              frame={0}
              palettes={palettes}
              offsetPosition
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Actor;
