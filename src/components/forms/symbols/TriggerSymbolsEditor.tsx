import React, { useCallback, useEffect, useState } from "react";
import l10n from "lib/helpers/l10n";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/configureStore";
import { triggerSelectors } from "store/features/entities/entitiesState";
import entitiesActions from "store/features/entities/entitiesActions";
import { FormField, FormRow } from "ui/form/FormLayout";
import { Input } from "ui/form/Input";
import { FixedSpacer, FlexRow } from "ui/spacing/Spacing";
import { CopyButton } from "ui/buttons/CopyButton";
import { interactScriptSymbol, updateScriptSymbol } from "lib/helpers/symbols";

interface TriggerSymbolsEditorProps {
  id: string;
}

export const TriggerSymbolsEditor = ({ id }: TriggerSymbolsEditorProps) => {
  const dispatch = useDispatch();

  const trigger = useSelector((state: RootState) =>
    triggerSelectors.selectById(state, id)
  );

  const [symbol, setSymbol] = useState(trigger?.symbol ?? "");

  const onChangeSymbol = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSymbol(e.currentTarget.value);
    },
    []
  );

  const onFinishedEditingSymbol = useCallback(() => {
    dispatch(
      entitiesActions.setTriggerSymbol({
        triggerId: id,
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
    setSymbol(trigger?.symbol ?? "");
  }, [trigger?.symbol]);

  return (
    <>
      <FormRow>
        <FormField name="symbol" label={l10n("FIELD_GBVM_TRIGGER_SYMBOL")}>
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
        <FormField
          name="symbol"
          label={l10n("FIELD_GBVM_INTERACT_SCRIPT_SYMBOL")}
        >
          <FlexRow>
            <Input value={interactScriptSymbol(symbol)} disabled />
            <FixedSpacer width={5} />
            <CopyButton value={interactScriptSymbol(symbol)} />
          </FlexRow>
        </FormField>
      </FormRow>
    </>
  );
};
