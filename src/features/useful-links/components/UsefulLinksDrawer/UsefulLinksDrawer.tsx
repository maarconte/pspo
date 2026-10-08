import "./UsefulLinksDrawer.scss";

import React, { useState } from "react";

import { Drawer } from "rsuite";
import { Link as LinkIcon } from "lucide-react";
import SafeHtml from "../../../../ui/SafeHtml";
import { getFormationLabel } from "../../../../utils/helpers/formationLabel";
import { useLocation } from "react-router-dom";
import { useModules } from "../../../admin/hooks/useModules";
import { useQuestionsStore } from "../../../../stores/useQuestionsStore";

export const UsefulLinksDrawer: React.FC = () => {
  const location = useLocation();
  const isAllowedPath =
    location.pathname === "/" || location.pathname === "/quizz";
  const [isOpen, setIsOpen] = useState(false);

  const formation = useQuestionsStore((s) => s.formation);
  const { modules } = useModules();
  const currentModule = modules.find(
    (m) => m.title === getFormationLabel(formation),
  );
  const usefulLinks = currentModule?.usefulLinks;

  if (!isAllowedPath || !usefulLinks) return null;

  return (
    <>
      <div
        className={`links-tab ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        id="useful-links-tab"
      >
        <LinkIcon size={18} />
        <span className="links-tab__label">Links</span>
      </div>

      <Drawer
        backdrop={true}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        placement="right"
        size="xs"
        className="links-drawer"
      >
        <Drawer.Header>
          <Drawer.Title>
            <div className="d-flex align-items-center gap-2">
              <LinkIcon size={20} />
              <span>Links</span>
            </div>
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <SafeHtml html={usefulLinks} className="links-drawer__content" />
        </Drawer.Body>
      </Drawer>
    </>
  );
};
