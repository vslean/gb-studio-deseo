import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/configureStore";
import { backgroundSelectors } from "store/features/entities/entitiesState";
import { Button } from "ui/buttons/Button";
import { MinusIcon, PlusIcon } from "ui/icons/Icons";
import l10n from "lib/helpers/l10n";
import styled from "styled-components";
import { FlexGrow } from "ui/spacing/Spacing";
import {
  tilemapAttrSymbol,
  tilemapSymbol,
  tilesetSymbol,
} from "lib/helpers/symbols";
import clipboardActions from "store/features/clipboard/clipboardActions";
import { TooltipWrapper } from "ui/tooltips/Tooltip";

export interface Reference {
  type: "background" | "sprite" | "font" | "music" | "emote" | "variable";
  id: string;
}

interface ReferencesSelectProps {
  value: Reference[];
  onChange: (newValue: Reference[]) => void;
}

const ReferenceRows = styled.div`
  padding-bottom: 10px;
`;

const ReferenceSymbol = styled.div`
  font-size: 11px;
  height: 18px;
  box-sizing: border-box;

  :hover {
    text-decoration: underline;
    cursor: pointer;

    span {
      text-decoration: none;
    }
  }

  span {
    margin-left: 5px;
    font-weight: normal;
  }
`;

const ReferenceRow = styled.div`
  margin: 0 -10px;
  padding: 5px 10px;

  ${ReferenceSymbol} {
    display: none;
  }

  :hover {
    background: ${(props) => props.theme.colors.sidebar.background};

    ${ReferenceSymbol} {
      display: block;
    }
  }
`;

const ReferenceRowHeader = styled.div`
  display: flex;
  font-weight: bold;
  font-size: 11px;
  height: 15px;
  margin-bottom: 5px;

  ${ReferenceSymbol} {
    display: block;
  }
`;

export const ReferencesSelect = ({
  value,
  onChange,
}: ReferencesSelectProps) => {
  const dispatch = useDispatch();

  const onRemove = useCallback(
    (id: string) => {
      onChange(value.filter((ref) => ref.id !== id));
    },
    [onChange, value]
  );

  const onCopy = useCallback(
    (symbol: string) => {
      dispatch(clipboardActions.copyText(symbol));
    },
    [dispatch]
  );

  const onCopyWithBank = useCallback(
    (symbol: string) => {
      dispatch(clipboardActions.copyText(`___bank${symbol}, ${symbol}`));
    },
    [dispatch]
  );

  return (
    <div>
      {value.length > 0 && (
        <ReferenceRows>
          {value
            .filter((ref) => ref.type === "background")
            .map((ref) => (
              <BackgroundReference
                key={ref.id}
                id={ref.id}
                onCopy={onCopyWithBank}
                onRemove={onRemove}
              />
            ))}
        </ReferenceRows>
      )}

      <Button size="small">{l10n("FIELD_ADD_REFERENCE")}</Button>
    </div>
  );
};

interface ReferenceProps {
  id: string;
  onCopy: (text: string) => void;
  onRemove: (id: string) => void;
}

export const BackgroundReference = ({
  id,
  onCopy,
  onRemove,
}: ReferenceProps) => {
  const background = useSelector((state: RootState) =>
    backgroundSelectors.selectById(state, id)
  );
  if (!background) {
    return null;
  }

  return (
    <ReferenceRow>
      <ReferenceRowHeader>
        <div onClick={() => onCopy(`_${background.symbol}`)}>
          <CopyableReferenceSymbol
            onCopy={onCopy}
            symbol={`_${background.symbol}`}
            name={background.name}
          />
        </div>
        <FlexGrow />
        <Button size="small" variant="transparent" onClick={() => onRemove(id)}>
          <MinusIcon />
        </Button>
      </ReferenceRowHeader>

      <CopyableReferenceSymbol
        onCopy={onCopy}
        symbol={`_${tilesetSymbol(background.symbol)}`}
      />

      <CopyableReferenceSymbol
        onCopy={onCopy}
        symbol={`_${tilemapSymbol(background.symbol)}`}
      />

      <CopyableReferenceSymbol
        onCopy={onCopy}
        symbol={`_${tilemapAttrSymbol(background.symbol)}`}
      />
    </ReferenceRow>
  );
};

interface CopyableReferenceSymbolProps {
  symbol: string;
  name?: string;
  onCopy: (text: string) => void;
}

const CopyableReferenceSymbol = ({
  symbol,
  name,
  onCopy,
}: CopyableReferenceSymbolProps) => {
  const [copied, setCopied] = useState(false);

  const onClickCopy = useCallback(() => {
    onCopy(symbol);
    setCopied(true);
  }, [onCopy, symbol]);

  const onMouseLeave = useCallback(() => {
    if (copied) {
      setCopied(false);
    }
  }, [copied]);

  return (
    <TooltipWrapper tooltip={l10n("FIELD_COPIED_TO_CLIPBOARD")} open={copied}>
      <ReferenceSymbol onClick={onClickCopy} onMouseLeave={onMouseLeave}>
        {symbol}
        {name && <span>({name})</span>}
      </ReferenceSymbol>
    </TooltipWrapper>
  );
};
