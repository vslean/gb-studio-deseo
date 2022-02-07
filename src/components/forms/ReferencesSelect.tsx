import React, {
  ChangeEvent,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/configureStore";
import {
  backgroundSelectors,
  musicSelectors,
  spriteSheetSelectors,
  variableSelectors,
} from "store/features/entities/entitiesState";
import { Button } from "ui/buttons/Button";
import { CheckIcon, MinusIcon, PencilIcon } from "ui/icons/Icons";
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
import { MenuOverlay } from "ui/menu/Menu";
import { RelativePortal } from "ui/layout/RelativePortal";
import AddReferenceMenu from "./AddReferenceMenu";
import { Input } from "ui/form/Input";
import entitiesActions from "store/features/entities/entitiesActions";

export type ReferenceType =
  | "background"
  | "sprite"
  | "font"
  | "music"
  | "emote"
  | "variable";

export interface Reference {
  type: ReferenceType;
  id: string;
}

interface ReferencesSelectProps {
  value: Reference[];
  onChange: (newValue: Reference[]) => void;
}

const ReferenceRows = styled.div`
  padding-bottom: 10px;
`;

const ReferenceName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ReferenceSymbol = styled.div`
  font-size: 11px;
  height: 18px;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;

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
  line-height: 18px;
  :hover {
    background: ${(props) => props.theme.colors.sidebar.background};
  }
`;

const ReferenceRowHeader = styled.div`
  display: flex;
  font-weight: bold;
  font-size: 11px;
  align-items: center;
`;

const ExtraReferences = styled.div`
  padding: 5px 0;
`;

export const ReferencesSelect = ({
  value,
  onChange,
}: ReferencesSelectProps) => {
  const dispatch = useDispatch();

  const [isOpen, setOpen] = useState(false);
  const [pinDirection, setPinDirection] =
    useState<"bottom-right" | "top-right">("bottom-right");

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

  const onOpen = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const boundingRect = e.currentTarget.getBoundingClientRect();
    if (boundingRect.top > window.innerHeight * 0.5) {
      setPinDirection("bottom-right");
    } else {
      setPinDirection("top-right");
    }
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  const onAdd = useCallback(
    (newRef: Reference) => {
      onChange([...value.filter((ref) => ref.id !== newRef.id), newRef]);
    },
    [onChange, value]
  );

  const backgroundRefs = value.filter((ref) => ref.type === "background");
  const spriteRefs = value.filter((ref) => ref.type === "sprite");
  const variableRefs = value.filter((ref) => ref.type === "variable");
  const musicRefs = value.filter((ref) => ref.type === "music");

  return (
    <div>
      {value.length > 0 && (
        <ReferenceRows>
          {backgroundRefs.map((ref) => (
            <AssetReference
              key={ref.id}
              id={ref.id}
              selector={(state) =>
                backgroundSelectors.selectById(state, ref.id)
              }
              onRename={(symbol) => {
                dispatch(
                  entitiesActions.setBackgroundSymbol({
                    backgroundId: ref.id,
                    symbol,
                  })
                );
              }}
              onCopy={onCopyWithBank}
              onRemove={onRemove}
              extraSymbols={(symbol) => [
                tilesetSymbol(symbol),
                tilemapSymbol(symbol),
                tilemapAttrSymbol(symbol),
              ]}
            />
          ))}
          {spriteRefs.map((ref) => (
            <AssetReference
              key={ref.id}
              id={ref.id}
              selector={(state) =>
                spriteSheetSelectors.selectById(state, ref.id)
              }
              onRename={(symbol) => {
                dispatch(
                  entitiesActions.setSpriteSheetSymbol({
                    spriteSheetId: ref.id,
                    symbol,
                  })
                );
              }}
              onCopy={onCopyWithBank}
              onRemove={onRemove}
              extraSymbols={(symbol) => [tilesetSymbol(symbol)]}
            />
          ))}
          {musicRefs.map((ref) => (
            <AssetReference
              key={ref.id}
              id={ref.id}
              selector={(state) => musicSelectors.selectById(state, ref.id)}
              onRename={(symbol) => {
                dispatch(
                  entitiesActions.setMusicSymbol({
                    musicId: ref.id,
                    symbol,
                  })
                );
              }}
              onCopy={onCopyWithBank}
              onRemove={onRemove}
            />
          ))}
          {variableRefs.map((ref) => (
            <VariableReference
              key={ref.id}
              id={ref.id}
              onCopy={onCopy}
              onRemove={onRemove}
            />
          ))}
        </ReferenceRows>
      )}

      {isOpen && (
        <>
          <MenuOverlay onClick={onClose} />
          <RelativePortal pin={pinDirection} offsetX={40} offsetY={20}>
            <AddReferenceMenu onBlur={onClose} onAdd={onAdd} />
          </RelativePortal>
        </>
      )}

      <Button size="small" onClick={onOpen}>
        {l10n("FIELD_ADD_REFERENCE")}
      </Button>
    </div>
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

interface ReferenceGroupProps {
  header: ReactNode;
  extraReferences?: ReactNode;
}

const ReferenceGroup = ({ header, extraReferences }: ReferenceGroupProps) => {
  const [expand, setExpanded] = useState(false);
  const timerRef = useRef<number>();

  const onMouseEnter = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setExpanded(true);
    }, 300);
  }, []);

  const onMouseLeave = useCallback(() => {
    clearTimeout(timerRef.current);
    setExpanded(false);
  }, []);

  return (
    <ReferenceRow onMouseLeave={onMouseLeave} onClick={() => setExpanded(true)}>
      <ReferenceRowHeader onMouseEnter={onMouseEnter}>
        {header}
      </ReferenceRowHeader>
      {expand && extraReferences && (
        <ExtraReferences>{extraReferences}</ExtraReferences>
      )}
    </ReferenceRow>
  );
};

const RenameWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const RenameInput = styled(Input)`
  &&&& {
    padding-right: 32px;
    height: 28px;
  }
`;

const RenameCompleteButton = styled.button`
  position: absolute;
  top: 3px;
  right: 3px;
  width: 22px;
  height: 22px;
  border: 0;
  border-radius: ${(props) => Math.max(0, props.theme.borderRadius - 1)}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 10px;
  font-size: 12px;
  font-weight: bold;
  background: transparent;
  border-color: transparent;

  :hover {
    background: rgba(128, 128, 128, 0.3);
  }
  :active {
    background: rgba(128, 128, 128, 0.4);
  }
  svg {
    width: 12px;
    height: 12px;
    fill: #333;
  }
`;

// --

interface ReferenceProps {
  id: string;
  onCopy: (text: string) => void;
  onRemove: (id: string) => void;
}

export const AssetReference = <
  T extends { id: string; symbol: string; name: string }
>({
  id,
  selector,
  onRename,
  onCopy,
  onRemove,
  extraSymbols,
}: {
  id: string;
  selector: (state: RootState) => T | undefined;
  onRename: (newSymbol: string) => void;
  onCopy: (text: string) => void;
  onRemove: (id: string) => void;
  extraSymbols?: (symbol: string) => string[];
}) => {
  const asset = useSelector(selector);

  const [renameVisible, setRenameVisible] = useState(false);
  const [customSymbol, setCustomSymbol] = useState("");

  const onStartEdit = useCallback(() => {
    setCustomSymbol(asset?.symbol ?? "");
    setRenameVisible(true);
  }, [asset?.symbol]);

  const onRenameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setCustomSymbol(e.currentTarget.value);
  }, []);

  const onRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onRenameFinish();
    } else if (e.key === "Escape") {
      setRenameVisible(false);
    }
  };

  const onRenameFinish = useCallback(() => {
    onRename(customSymbol);
    setRenameVisible(false);
  }, [customSymbol, onRename]);

  const onRenameFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  }, []);

  if (!asset) {
    return null;
  }

  const extra = extraSymbols?.(asset.symbol) ?? [];

  return (
    <ReferenceGroup
      header={
        renameVisible ? (
          <RenameWrapper>
            <RenameInput
              value={customSymbol}
              onChange={onRenameChange}
              onKeyDown={onRenameKeyDown}
              onFocus={onRenameFocus}
              autoFocus
            />
            <RenameCompleteButton
              onClick={onRenameFinish}
              title={l10n("FIELD_RENAME")}
            >
              <CheckIcon />
            </RenameCompleteButton>
          </RenameWrapper>
        ) : (
          <>
            <ReferenceName onClick={() => onCopy(`_${asset.symbol}`)}>
              <CopyableReferenceSymbol
                onCopy={onCopy}
                symbol={`_${asset.symbol}`}
                name={asset.name}
              />
            </ReferenceName>
            <FlexGrow />
            <Button
              size="small"
              variant="transparent"
              onClick={() => onStartEdit()}
            >
              <PencilIcon />
            </Button>
            <Button
              size="small"
              variant="transparent"
              onClick={() => onRemove(id)}
            >
              <MinusIcon />
            </Button>
          </>
        )
      }
      extraReferences={
        extra.length > 0 &&
        extra.map((symbol) => (
          <CopyableReferenceSymbol
            key={symbol}
            onCopy={onCopy}
            symbol={symbol}
          />
        ))
      }
    />
  );
};

export const VariableReference = ({ id, onCopy, onRemove }: ReferenceProps) => {
  const dispatch = useDispatch();

  const variable = useSelector((state: RootState) =>
    variableSelectors.selectById(state, id)
  );
  const symbol = variable?.symbol.toUpperCase() ?? `VAR_${id}`;
  const variableName = variable?.name ?? "";

  const [renameVisible, setRenameVisible] = useState(false);
  const [customSymbol, setCustomSymbol] = useState("");

  const onStartEdit = useCallback(() => {
    setCustomSymbol(variableName);
    setRenameVisible(true);
  }, [variableName]);

  const onRenameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setCustomSymbol(e.currentTarget.value);
  }, []);

  const onRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onRenameFinish();
    } else if (e.key === "Escape") {
      setRenameVisible(false);
    }
  };

  const onRenameFinish = useCallback(() => {
    dispatch(
      entitiesActions.renameVariable({ variableId: id, name: customSymbol })
    );
    setRenameVisible(false);
  }, [customSymbol, dispatch, id]);

  return (
    <ReferenceGroup
      header={
        renameVisible ? (
          <RenameWrapper>
            <RenameInput
              value={customSymbol}
              onChange={onRenameChange}
              onKeyDown={onRenameKeyDown}
            />
            <RenameCompleteButton
              onClick={onRenameFinish}
              title={l10n("FIELD_RENAME")}
            >
              <CheckIcon />
            </RenameCompleteButton>
          </RenameWrapper>
        ) : (
          <>
            <ReferenceName onClick={() => onCopy(symbol)}>
              <CopyableReferenceSymbol
                onCopy={onCopy}
                symbol={symbol}
                name={variable?.name}
              />
            </ReferenceName>
            <FlexGrow />
            <Button
              size="small"
              variant="transparent"
              onClick={() => onStartEdit()}
            >
              <PencilIcon />
            </Button>
            <Button
              size="small"
              variant="transparent"
              onClick={() => onRemove(id)}
            >
              <MinusIcon />
            </Button>
          </>
        )
      }
    />
  );
};
