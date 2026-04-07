import React, { useState } from "react";
import { Drawer, Input, List } from "rsuite";
import { Button } from "../../../../ui";
import { Button_Type } from "../../../../ui/Button/Button.types";
import { Users, Plus, Trash2, X } from "lucide-react";
import { useCoopStore } from "../../../../stores/useCoopStore";
import "./CoopDrawer.scss";

export const CoopDrawer: React.FC = () => {
  const {
    participants,
    isOpen,
    addParticipant,
    removeParticipant,
    toggleDrawer,
    setOpen,
  } = useCoopStore();

  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newName.trim()) return;

    const result = addParticipant(newName);
    if (result.success) {
      setNewName("");
      setError(null);
    } else {
      setError(result.error || "Erreur lors de l'ajout");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <>
      {/* Tab (Languette) */}
      <div
        className={`coop-tab ${isOpen ? "open" : ""}`}
        onClick={toggleDrawer}
        id="coop-mode-tab"
      >
        <Users size={18} />
        <span className="coop-tab__label">Mode coop</span>
        {participants.length > 0 && (
          <span className="coop-tab__badge">{participants.length}</span>
        )}
      </div>

      <Drawer
        backdrop={true}
        open={isOpen}
        onClose={() => setOpen(false)}
        placement="right"
        size="xs"
        className="coop-drawer"
      >
        <Drawer.Header>
          <Drawer.Title>
            <div className="d-flex align-items-center gap-2">
              <Users size={20} />
              <span>Mode coop ({participants.length})</span>
            </div>
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <div className="coop-drawer__content">
            <p className="coop-drawer__description">
              Outil de collaboration, inscrivez le prénom des différents participants
            </p>

            <div className="coop-drawer__form">
              <div className={`coop-drawer__input-group ${error ? "has-error" : ""}`}>
                <Input
                  placeholder="Prénom..."
                  value={newName}
                  onChange={(val) => setNewName(val)}
                  onKeyPress={handleKeyPress}
                  className="coop-drawer__input"
                />
                <Button
                  appearance="primary"
                  onClick={handleAdd}
                  disabled={participants.length >= 30}
                  className="coop-drawer__add-btn"
                  label="Ajouter"
                  icon={<Plus size={18} />}
                />
              </div>
              {error && <p className="coop-drawer__error">{error}</p>}
            </div>

            <div className="coop-drawer__list-container">
              {participants.length > 0 ? (
                <List hover className="coop-drawer__list">
                  {participants.map((name, index) => (
                    <List.Item key={`${name}-${index}`} className="coop-drawer__item">
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <span className="coop-drawer__name">{name}</span>
                        <Button
                          onClick={() => removeParticipant(index)}
                          className="coop-drawer__remove-btn"
                          type={Button_Type.WHITE}
                          size="sm"
                          icon={<Trash2 size={16} />}

                        />
                      </div>
                    </List.Item>
                  ))}
                </List>
              ) : (
                <div className="coop-drawer__empty">
                  Aucun participant pour le moment
                </div>
              )}
            </div>
          </div>
        </Drawer.Body>
      </Drawer>
    </>
  );
};
