import React, { useState, useEffect, useRef, useCallback } from "react";
import { DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { fetchArtworks } from "@/services/artworkApi";
import type { Artwork } from "@/types/artwork";
import SelectionOverlay from "@/components/SelectionOverlay";

const Index: React.FC = () =>  {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(12);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const overlayRef = useRef<OverlayPanel>(null);

  const loadPage  = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await fetchArtworks(page);
      setArtworks(response.data);
      setTotalRecords(response.pagination.total);
      setCurrentPage(page);
    } catch (error) {
      console.error ("Failed to fetch artworks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  const onPageChange = (event: DataTablePageEvent) => {
    const newPage = Math.floor ((event.first ?? 0) / (event.rows ?? rowsPerPage)) + 1;
    loadPage(newPage);
  };

  const selectedRowsOnCurrentPage = artworks.filter((a) => selectedIds.has(a.id));

  const onSelectionChange = (e: { value: Artwork[] }) => {
    const currentPageIds = new Set(artworks.map((a) => a.id));
    const newSelected = new Set(selectedIds);
    currentPageIds.forEach((id) => newSelected.delete(id));
    e.value.forEach((row) => newSelected.add(row.id));
    setSelectedIds(newSelected);
  };

  const handleSelectRows = (n: number) => {
    const currentPageIds = new Set(artworks.map((a) => a.id));
    const newSelected = new Set(selectedIds);
    currentPageIds.forEach((id) => newSelected.delete(id));
    artworks.slice(0, n).forEach((row) => newSelected.add(row.id));
    setSelectedIds(newSelected);
  };

  const totalPages = Math.ceil(totalRecords / rowsPerPage);
  const showingFirst = totalRecords > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const showingLast =  Math.min(currentPage * rowsPerPage, totalRecords);

  const getVisiblePages = () => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-foreground">
        Art Institute of Chicago — Artworks
      </h2>
      <Button 
        icon="pi pi-chevron-down"
        label="Select rows…"
        className="p-button-outlined p-button-sm"
        onClick= {(e) => overlayRef.current?.toggle(e)}
      />
    </div>
  );

  return (
    <main className="min-h-screen bg-background p-6">
      <DataTable
        value={artworks}
        lazy
        paginator={false}
        rows={rowsPerPage}
        totalRecords={totalRecords}
        loading={loading}
        selection={selectedRowsOnCurrentPage}
        onSelectionChange={onSelectionChange}
        dataKey="id"
        header={renderHeader()}
        selectionMode="multiple"
        tableStyle={{ minWidth: "60rem" }}
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="title" header="Title" />
        <Column field="place_of_origin" header="Place of Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Date Start" />
        <Column field="date_end" header="Date End" />
      </DataTable>

      <div className="flex items-center justify-between mt-4 px-2">
        <span className="text-sm text-muted-foreground">
          Showing {showingFirst} to {showingLast} of {totalRecords} entries
        </span>
        <div className="flex items-center gap-1">
          <button
            className="px-3 py-1.5 text-sm rounded-md border border-border bg-background text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent transition-colors"
            disabled={currentPage === 1}
            onClick={() => loadPage(currentPage - 1)}
          >
            Previous
          </button>
          {getVisiblePages().map((p) => (
            <button
              key={p}
              className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                p === currentPage
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-background text-foreground hover:bg-accent"
              }`}
              onClick={() => loadPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="px-3 py-1.5 text-sm rounded-md border border-border bg-background text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent transition-colors"
            disabled={currentPage >= totalPages}
            onClick={() => loadPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      <SelectionOverlay
        overlayRef={overlayRef as React.RefObject<OverlayPanel>}
        currentPageRowCount={artworks.length}
        onSelectRows={handleSelectRows}
      />
    </main>
  );
};

export default Index;
