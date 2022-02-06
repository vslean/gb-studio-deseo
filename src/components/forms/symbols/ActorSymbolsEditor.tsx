import React, { useCallback, useEffect, useState } from "react";
import l10n from "lib/helpers/l10n";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/configureStore";
import { actorSelectors } from "store/features/entities/entitiesState";
import entitiesActions from "store/features/entities/entitiesActions";
import { FormField, FormRow } from "ui/form/FormLayout";
import { Input } from "ui/form/Input";
import { FixedSpacer, FlexRow } from "ui/spacing/Spacing";
import { CopyButton } from "ui/buttons/CopyButton";
import { interactScriptSymbol, updateScriptSymbol } from "lib/helpers/symbols";

interface ActorSymbolsEditorProps {
  id: string;
}

export const ActorSymbolsEditor = ({ id }: ActorSymbolsEditorProps) => {
  const dispatch = useDispatch();

  const actor = useSelector((state: RootState) =>
    actorSelectors.selectById(state, id)
  );

  const [symbol, setSymbol] = useState(actor?.symbol ?? "");

  const onChangeSymbol = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSymbol(e.currentTarget.value);
    },
    []
  );

  const onFinishedEditingSymbol = useCallback(() => {
    dispatch(
      entitiesActions.setActorSymbol({
        actorId: id,
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
    setSymbol(actor?.symbol ?? "");
  }, [actor?.symbol]);

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
      <FormRow>
        <FormField
          name="symbol"
          label={l10n("FIELD_GBVM_UPDATE_SCRIPT_SYMBOL")}
        >
          <FlexRow>
            <Input value={updateScriptSymbol(symbol)} disabled />
            <FixedSpacer width={5} />
            <CopyButton value={updateScriptSymbol(symbol)} />
          </FlexRow>
        </FormField>
      </FormRow>
    </>
  );
};
