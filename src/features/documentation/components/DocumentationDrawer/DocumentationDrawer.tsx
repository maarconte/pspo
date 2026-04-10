import React, { useState } from "react";
import { Drawer } from "rsuite";
import { FileText } from "lucide-react";
import pdfUrl from "../../../../assets/img/StudyGroup-PSPO1-Super-PDF-v2.2.pdf";
import "./DocumentationDrawer.scss";

export const DocumentationDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* Tab (Languette) */}
      <div
        className={`doc-tab ${isOpen ? "open" : ""}`}
        onClick={toggleDrawer}
        id="documentation-tab"
      >
        <FileText size={18} />
        <span className="doc-tab__label">Documentation</span>
      </div>

      <Drawer
        backdrop={true}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        placement="right"
        size="lg"
        className="doc-drawer"
      >
        <Drawer.Header>
          <Drawer.Title>
            <div className="d-flex align-items-center gap-2">
              <FileText size={20} />
              <span>Documentation</span>
            </div>
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="doc-drawer__body">
          <iframe
            src={pdfUrl}
            title="Documentation PDF"
            className="doc-drawer__iframe"
          />
        </Drawer.Body>
      </Drawer>
    </>
  );
};
