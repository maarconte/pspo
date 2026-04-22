import React, { useState, useEffect } from "react";
import { Drawer, Input, List } from "rsuite";
import { Button } from "../../../../ui";
import { Button_Type, Button_Style } from "../../../../ui/Button/Button.types";
import { Users, Plus, Trash2, X } from "lucide-react";
import { useCoopStore } from "../../../../stores/useCoopStore";
import { useUserStore } from "../../../../stores/useUserStore";
import { useLocation } from "react-router-dom";
import "./CoopDrawer.scss";

export const CoopDrawer: React.FC = () => {
  const { user } = useUserStore();
  const location = useLocation();
  const isAllowedPath = location.pathname === "/" || location.pathname === "/quizz";

  const currentUserName = user?.displayName || user?.email?.split("@")[0] || null;

  const {
    participants,
    isOpen,
    addParticipant,
    removeParticipant,
    toggleDrawer,
    setOpen,
    clearParticipants,
  } = useCoopStore();

  const isUserInParticipants = currentUserName ? participants.includes(currentUserName) : false;

  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Auto-add current user if logged in
  useEffect(() => {
    if (user && currentUserName && !participants.includes(currentUserName)) {
      addParticipant(currentUserName);
    }
  }, [user, currentUserName, addParticipant]); // Only run when user/name changes, not when participants list changes

  if (!isAllowedPath) return null;

  const handleAdd = () => {
    if (!newName.trim()) return;

    const result = addParticipant(newName);
    if (result.success) {
      setNewName("");
      setError(null);
    } else {
      setError(result.error || "Error adding participant");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  const handleRemove = (index: number) => {
    removeParticipant(index);
    setError(null);
  };

  const handleClear = () => {
    clearParticipants();
    setError(null);
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
        <span className="coop-tab__label">Co-op Mode</span>
        {participants.length > 1 && (
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
              <span>Co-op Mode ({participants.length})</span>
            </div>
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <div className="coop-drawer__content">
            <p className="coop-drawer__description">
              Collaboration tool: enter the names of the participants.
            </p>

            {user && currentUserName && !isUserInParticipants && (
              <div className="coop-drawer__suggestion">
                <div className="coop-drawer__suggestion-text">
                  <span>Welcome back, <strong>{currentUserName}</strong>!</span>
                </div>
                <Button
                  label="Add automatically"
                  icon={<Plus size={16} />}
                  onClick={() => addParticipant(currentUserName)}
                  type={Button_Type.PRIMARY}
                  style={Button_Style.TONAL}
                  size="S"
                  className="w-100 mt-2"
                />
              </div>
            )}

            <div className="coop-drawer__form">
              <div className={`coop-drawer__input-group ${error ? "has-error" : ""}`}>
                <Input
                  placeholder="First name..."
                  value={newName}
                  onChange={(val) => setNewName(val)}
                  onKeyPress={handleKeyPress}
                  className="coop-drawer__input"
                />
                <Button
                  appearance="primary"
                  onClick={handleAdd}
                  className="coop-drawer__add-btn"
                  label="Add"
                  icon={<Plus size={18} />}
                />
              </div>
              {error && <p className="coop-drawer__error">{error}</p>}
            </div>

            <div className="coop-drawer__list-container">
              {participants.length > 0 ? (
                <>
                  <div className="coop-drawer__list-header">
                    <h3>Participants</h3>
                    <Button
                      onClick={handleClear}
                      type={Button_Type.SECONDARY}
                      style={Button_Style.OUTLINED}
                      size="S"
                      label="Clear all"
                      //className="coop-drawer__clear-btn"
                      icon={<X size={14} color="red" />}
                    />
                  </div>
                  <List hover className="coop-drawer__list">
                  {participants.map((name, index) => (
                    <List.Item key={`${name}-${index}`} className="coop-drawer__item">
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <span className="coop-drawer__name">{name}</span>
                        <Button
                          onClick={() => handleRemove(index)}
                          className="coop-drawer__remove-btn"
                          type={Button_Type.WHITE}
                          size="sm"
                          icon={<Trash2 size={16} />}

                        />
                      </div>
                    </List.Item>
                  ))}
                  </List>
                </>
              ) : (
                <div className="coop-drawer__empty">
                  No participants yet
                </div>
              )}
            </div>
          </div>
        </Drawer.Body>
      </Drawer>
    </>
  );
};
