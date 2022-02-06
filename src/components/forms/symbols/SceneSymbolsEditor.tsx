import React, { useCallback, useEffect, useState } from "react";
import l10n from "lib/helpers/l10n";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/configureStore";
import { sceneSelectors } from "store/features/entities/entitiesState";
import entitiesActions from "store/features/entities/entitiesActions";
import { FormField, FormRow } from "ui/form/FormLayout";
import { Input } from "ui/form/Input";
import { FixedSpacer, FlexRow } from "ui/spacing/Spacing";
import { CopyButton } from "ui/buttons/CopyButton";
import { initScriptSymbol } from "lib/helpers/symbols";

interface SceneSymbolsEditorProps {
  id: string;
}

export const SceneSymbolsEditor = ({ id }: SceneSymbolsEditorProps) => {
  const dispatch = useDispatch();

  const scene = useSelector((state: RootState) =>
    sceneSelectors.selectById(state, id)
  );

  const [symbol, setSymbol] = useState(scene?.symbol ?? "");

  const onChangeSymbol = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSymbol(e.currentTarget.value);
    },
    []
  );

  const onFinishedEditingSymbol = useCallback(() => {
    dispatch(
      entitiesActions.setSceneSymbol({
        sceneId: id,
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
    setSymbol(scene?.symbol ?? "");
  }, [scene?.symbol]);

  return (
    <>
      <FormRow>
        <FormField name="symbol" label={l10n("FIELD_GBVM_SYMBOL")}>
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
        <FormField name="symbol" label={l10n("FIELD_GBVM_INIT_SCRIPT_SYMBOL")}>
          <FlexRow>
            <Input value={initScriptSymbol(symbol)} disabled />
            <FixedSpacer width={5} />
            <CopyButton value={initScriptSymbol(symbol)} />
          </FlexRow>
        </FormField>
      </FormRow>
    </>
  );
};
