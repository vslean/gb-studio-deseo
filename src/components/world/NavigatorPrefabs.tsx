import React, { FC, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/configureStore";
import { getPrefabActors } from "store/features/entities/entitiesState";
import { FlatList } from "ui/lists/FlatList";
import editorActions from "store/features/editor/editorActions";
import { Actor } from "store/features/entities/entitiesTypes";
import styled from "styled-components";
import { CodeIcon, PlusCircleIcon } from "ui/icons/Icons";
import l10n from "lib/helpers/l10n";
import { Button } from "ui/buttons/Button";
import { FlexGrow } from "ui/spacing/Spacing";

interface NavigatorPrefabsProps {
  height: number;
}

interface NavigatorItem {
  id: string;
  name: string;
}

const actorToNavigatorItem = (
  actor: Actor,
  actorIndex: number
): NavigatorItem => ({
  id: actor.id,
  name: actor.name ? actor.name : `${l10n("FIELD_PREFAB")} ${actorIndex + 1}`,
});

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

const sortByName = (a: NavigatorItem, b: NavigatorItem) => {
  return collator.compare(a.name, b.name);
};

const NavigatorEntityRow = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  display: flex;
  align-items: center;
  width: 100%;
  & > svg {
    fill: ${(props) => props.theme.colors.text};
    width: 10px;
    height: 10px;
    margin-right: 5px;
    opacity: 0.5;
  }
  button {
    padding: 0;
    height: 17px;
    svg {
      width: 12px;
      height: 12px;
      min-height: 12px;
      min-width: 12px;
    }
  }
`;

export const NavigatorPrefabs: FC<NavigatorPrefabsProps> = ({ height }) => {
  const [items, setItems] = useState<NavigatorItem[]>([]);
  const prefabActors = useSelector((state: RootState) =>
    getPrefabActors(state)
  );

  const entityId = useSelector((state: RootState) => state.editor.entityId);
  const editorType = useSelector((state: RootState) => state.editor.type);
  const selectedId = editorType === "prefabActor" ? entityId : "";
  const dispatch = useDispatch();

  useEffect(() => {
    setItems(prefabActors.map(actorToNavigatorItem).sort(sortByName));
  }, [prefabActors]);

  const setSelectedId = useCallback(
    (id: string) => {
      dispatch(editorActions.selectPrefabActor({ actorId: id }));
    },
    [dispatch]
  );

  const setActorInstanciateMode = useCallback(
    (id: string) => {
      console.log("Instanciate ", id);
      dispatch(
        editorActions.setActorDefaults({
          prefabId: id,
        })
      );
    },
    [dispatch]
  );

  return (
    <FlatList
      selectedId={selectedId}
      items={items}
      setSelectedId={setSelectedId}
      height={height}
      children={({ item }) => (
        <NavigatorEntityRow>
          <CodeIcon />
          {item.name}
          <FlexGrow />
          {item.id === selectedId && (
            <Button
              size="small"
              variant="transparent"
              title={l10n(`FIELD_PREFAB_INSTANTIATE`)}
              onClick={(e) => {
                e.stopPropagation();
                setActorInstanciateMode(item.id);
              }}
            >
              <PlusCircleIcon />
            </Button>
          )}
        </NavigatorEntityRow>
      )}
    />
  );
};
