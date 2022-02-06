import React, { useCallback, useEffect, useState } from "react";
import l10n from "lib/helpers/l10n";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/configureStore";
import { backgroundSelectors } from "store/features/entities/entitiesState";
import entitiesActions from "store/features/entities/entitiesActions";
import { FormField, FormRow } from "ui/form/FormLayout";
import { Input } from "ui/form/Input";
import { FixedSpacer, FlexRow } from "ui/spacing/Spacing";
import { CopyButton } from "ui/buttons/CopyButton";
import {
  tilesetSymbol,
  tilemapSymbol,
  tilemapAttrSymbol,
} from "lib/helpers/symbols";

interface BackgroundSymbolsEditorProps {
  id: string;
}

export const BackgroundSymbolsEditor = ({
  id,
}: BackgroundSymbolsEditorProps) => {
  const dispatch = useDispatch();

  const background = useSelector((state: RootState) =>
    backgroundSelectors.selectById(state, id)
  );

  const [symbol, setSymbol] = useState(background?.symbol ?? "");

  const onChangeSymbol = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSymbol(e.currentTarget.value);
    },
    []
  );

  const onFinishedEditingSymbol = useCallback(() => {
    dispatch(
      entitiesActions.setBackgroundSymbol({
        backgroundId: id,
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
    setSymbol(background?.symbol ?? "");
  }, [background?.symbol]);

  return (
    <>
      <FormRow>
        <FormField name="symbol" label={l10n("FIELD_GBVM_BACKGROUND_SYMBOL")}>
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
      <FormRow>
        <FormField name="symbol" label={l10n("FIELD_GBVM_TILEMAP_SYMBOL")}>
          <FlexRow>
            <Input value={tilemapSymbol(symbol)} disabled />
            <FixedSpacer width={5} />
            <CopyButton value={tilemapSymbol(symbol)} />
          </FlexRow>
        </FormField>
      </FormRow>
      <FormRow>
        <FormField name="symbol" label={l10n("FIELD_GBVM_TILEMAP_ATTR_SYMBOL")}>
          <FlexRow>
            <Input value={tilemapAttrSymbol(symbol)} disabled />
            <FixedSpacer width={5} />
            <CopyButton value={tilemapAttrSymbol(symbol)} />
          </FlexRow>
        </FormField>
      </FormRow>
    </>
  );
};
