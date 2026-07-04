import { useEffect, useState } from "react";

import { useAuth } from "../../contexts/AuthContext";
import {
  useSelectedChild,
} from "../../contexts/SelectedChildContext";

import {
  getChildren,
} from "../../services/childService";

import type { Child } from "../../types/child";

export default function ChildSelector() {
  const { user } = useAuth();

  const {
    selectedChild,
    setSelectedChild,
  } = useSelectedChild();

  const [children, setChildren] = useState<Child[]>([]);

  useEffect(() => {
    async function loadChildren() {
      if (!user) return;

      const data = await getChildren(user.uid);

      setChildren(data);

      // Automatically select the first active child
      if (
        !selectedChild &&
        data.length > 0
      ) {
        const firstActive =
          data.find(
            (child) =>
              child.status === "active"
          ) ?? data[0];

        setSelectedChild(firstActive);
      }
    }

    loadChildren();
  }, [user]);

  return (
    <div className="flex items-center gap-3">

      <label className="text-sm font-medium text-gray-600">
        Current Child
      </label>

      <select
        value={selectedChild?.id ?? ""}
        onChange={(e) => {
          const child = children.find(
            (c) =>
              c.id === e.target.value
          );

          if (child) {
            setSelectedChild(child);
          }
        }}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
      >
        {children.length === 0 && (
          <option value="">
            No Children
          </option>
        )}

        {children.map((child) => (
          <option
            key={child.id}
            value={child.id}
          >
            {child.firstName}{" "}
            {child.lastName}
          </option>
        ))}
      </select>

    </div>
  );
}