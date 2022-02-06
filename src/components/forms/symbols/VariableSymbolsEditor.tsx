import React from "react";
import l10n from "lib/helpers/l10n";
import { useSelector } from "react-redux";
import { RootState } from "store/configureStore";
import { variableSelectors } from "store/features/entities/entitiesState";
import { FormField, FormRow } from "ui/form/FormLayout";
import { Input } from "ui/form/Input";
import { FixedSpacer, FlexRow } from "ui/spacing/Spacing";
import { CopyButton } from "ui/buttons/CopyButton";

interface VariableSymbolsEditorProps {
  id: string;
}

export const VariableSymbolsEditor = ({ id }: VariableSymbolsEditorProps) => {
  const variable = useSelector((state: RootState) =>
    variableSelectors.selectById(state, id)
  );

  const symbol =
    variable && variable.symbol ? variable.symbol.toUpperCase() : `VAR_${id}`;

  return (
    <>
      <FormRow>
        <FormField name="symbol" label={l10n("FIELD_GBVM_VARIABLE_SYMBOL")}>
          <FlexRow>
            <Input value={symbol} disabled />
            <FixedSpacer width={5} />
            <CopyButton value={symbol} />
          </FlexRow>
        </FormField>
      </FormRow>
    </>
  );
};
