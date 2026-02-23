import React, { useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

interface SelectionOverlayProps {
  overlayRef: React.RefObject<OverlayPanel>;
  currentPageRowCount: number;
  onSelectRows: (n: number) => void;
}

const SelectionOverlay: React.FC<SelectionOverlayProps> = ({
  overlayRef,
  currentPageRowCount,
  onSelectRows,
}) => {
  const [inputValue, setInputValue] = useState<number | null>(null);

  const handleSubmit = () => {
    if (inputValue != null && inputValue > 0) {
      const clamped = Math.min(inputValue, currentPageRowCount);
      onSelectRows(clamped);
      overlayRef.current?.hide();
    }
  };

  return (
    <OverlayPanel ref={overlayRef} className="p-4" style={{ minWidth: "260px" }}>
      <div className="flex flex-col gap-3">
        <label htmlFor="selectRowCount" className="text-sm font-medium text-foreground">
          Select first N rows
        </label>
        <InputNumber
          id="selectRowCount"
          value={inputValue}
          onValueChange={(e) => setInputValue(e.value ?? null)}
          min={1}
          placeholder="Enter number..."
          className="w-full"
        />
        {inputValue != null && inputValue > currentPageRowCount && (
          <p className="text-xs text-destructive">
            Only {currentPageRowCount} rows on this page. Will select all.
          </p>
        )}
        <Button
          label="Select"
          icon="pi pi-check"
          onClick={handleSubmit}
          className="p-button-sm"
        />
      </div>
    </OverlayPanel>
  );
};

export default SelectionOverlay;

