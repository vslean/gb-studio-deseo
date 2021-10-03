import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/configureStore";
import {
  paletteSelectors,
  getPrefabActors,
} from "store/features/entities/entitiesState";
import { ActorDirection } from "store/features/entities/entitiesTypes";
import {
  Option,
  Select,
  OptionLabelWithPreview,
  SingleValueWithPreview,
  SelectCommonProps,
} from "ui/form/Select";
import SpriteSheetCanvas from "../world/SpriteSheetCanvas";
import { prefabActorName } from "store/features/entities/entitiesHelpers";
import l10n from "lib/helpers/l10n";

interface ActorPrefabSelectProps extends SelectCommonProps {
  name: string;
  value?: string;
  direction?: ActorDirection;
  frame?: number;
  paletteId?: string;
  onChange?: (newId: string) => void;
  optional?: boolean;
  optionalLabel?: string;
}

type ActorOption = Option & {
  spriteSheetId?: string;
  direction?: ActorDirection;
};

export const ActorPrefabSelect: FC<ActorPrefabSelectProps> = ({
  value,
  direction,
  frame,
  paletteId,
  onChange,
  optional,
  optionalLabel,
  ...selectProps
}) => {
  const prefabActors = useSelector((state: RootState) =>
    getPrefabActors(state)
  );
  const palette = useSelector((state: RootState) =>
    paletteSelectors.selectById(state, paletteId || "")
  );
  const [options, setOptions] = useState<ActorOption[]>([]);
  const [currentValue, setCurrentValue] = useState<ActorOption>();

  useEffect(() => {
    setOptions([
      ...(optional
        ? ([
            {
              value: "",
              label: optionalLabel || l10n("FIELD_NONE"),
            },
          ] as ActorOption[])
        : ([] as ActorOption[])),
      ...prefabActors.map((actor, actorIndex) => {
        return {
          label: prefabActorName(actor, actorIndex),
          value: actor.id,
          spriteSheetId: actor.spriteSheetId,
          direction: actor.direction,
        };
      }),
    ]);
  }, [prefabActors, optional, optionalLabel]);

  useEffect(() => {
    setCurrentValue(
      options.find((option) => {
        return option.value === value;
      }) || options[0]
    );
  }, [options, value]);

  const onSelectChange = (newValue: Option) => {
    onChange?.(newValue.value);
  };

  return (
    <Select
      value={currentValue}
      options={options}
      onChange={onSelectChange}
      formatOptionLabel={(option: ActorOption) => {
        return (
          <OptionLabelWithPreview
            preview={
              option.spriteSheetId ? (
                <SpriteSheetCanvas
                  spriteSheetId={option.spriteSheetId}
                  direction={direction || option.direction}
                  frame={frame}
                  palette={palette}
                />
              ) : (
                <></>
              )
            }
          >
            {option.label}
          </OptionLabelWithPreview>
        );
      }}
      components={{
        SingleValue: () =>
          currentValue?.spriteSheetId ? (
            <SingleValueWithPreview
              preview={
                <SpriteSheetCanvas
                  spriteSheetId={currentValue.spriteSheetId}
                  direction={direction || currentValue.direction}
                  frame={frame}
                  palette={palette}
                />
              }
            >
              {currentValue?.label}
            </SingleValueWithPreview>
          ) : (
            currentValue?.label
          ),
      }}
      {...selectProps}
    />
  );
};
