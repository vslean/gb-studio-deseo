import React, { useCallback, useEffect, useState } from "react";
import l10n from "lib/helpers/l10n";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/configureStore";
import { spriteSheetSelectors } from "store/features/entities/entitiesState";
import entitiesActions from "store/features/entities/entitiesActions";
import { FormField, FormRow } from "ui/form/FormLayout";
import { Input } from "ui/form/Input";
import { FixedSpacer, FlexRow } from "ui/spacing/Spacing";
import { CopyButton } from "ui/buttons/CopyButton";
import { tilesetSymbol } from "lib/helpers/symbols";

interface SpriteSymbolsEditorProps {
  id: string;
}

export const SpriteSymbolsEditor = ({ id }: SpriteSymbolsEditorProps) => {
  const dispatch = useDispatch();

  const sprite = useSelector((state: RootState) =>
    spriteSheetSelectors.selectById(state, id)
  );

  const [symbol, setSymbol] = useState(sprite?.symbol ?? "");

  const onChangeSymbol = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSymbol(e.currentTarget.value);
    },
    []
  );

  const onFinishedEditingSymbol = useCallback(() => {
    dispatch(
      entitiesActions.setSpriteSheetSymbol({
        spriteSheetId: id,
        symbol: symbol,
      })
    );
  }, [dispatch, id, symbol]);

  const onKeyDownSymbol = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onFinishedEditingSymbol();
      }
    },
    [onFinishedEditingSymbol]
  );

  useEffect(() => {
    setSymbol(sprite?.symbol ?? "");
  }, [sprite?.symbol]);

  return (
    <>
      <FormRow>
        <FormField name="symbol" label={l10n("FIELD_GBVM_SPRITE_SYMBOL")}>
          <FlexRow>
            <Input
              value={symbol}
              onChange={onChangeSymbol}
              onKeyDown={onKeyDownSymbol}
              onBlur={onFinishedEditingSymbol}
            />
            <FixedSpacer width={5} />
            <CopyButton value={symbol} />
          </FlexRow>
        </FormField>
      </FormRow>
      <FormRow>
        <FormField name="symbol" label={l10n("FIELD_GBVM_TILESET_SYMBOL")}>
          <FlexRow>
            <Input value={tilesetSymbol(symbol)} disabled />
            <FixedSpacer width={5} />
            <CopyButton value={tilesetSymbol(symbol)} />
          </FlexRow>
        </FormField>
      </FormRow>
    </>
  );
};
