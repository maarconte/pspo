import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RotiStats } from "../features/roti";
import Button from "../ui/Button/Button";
import { Button_Style } from "../ui/Button/Button.types";

/** Admin-only page (route guarded by RoleChecker): ROTI ratings statistics. */
export default function AdminRoti() {
  const navigate = useNavigate();

  return (
    <div className="AdminRoti">
      <div className="container">
        <div className="d-flex align-items-center gap-1 mb-2">
          <Button
            label="Back"
            icon={<ArrowLeft size={16} />}
            style={Button_Style.OUTLINED}
            onClick={() => navigate("/admin")}
          />
          <h1 className="mb-0">ROTI</h1>
        </div>
        <RotiStats />
      </div>
    </div>
  );
}
