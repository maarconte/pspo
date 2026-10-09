import "./style.scss";

import { FilterX } from "lucide-react";

export default function ReviewEmptyState() {
  return (
    <div className="ReviewEmptyState">
      <FilterX size={48} color="#755ebc" />
      <p>No questions match this filter.</p>
    </div>
  );
}
