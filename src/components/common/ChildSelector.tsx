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
      console.log("========== Child Selector ==========");

      if (!user) {
        console.log("❌ User is NULL");
        return;
      }

      console.log("✅ User:", user);
      console.log("UID:", user.uid);

      try {
        const data = await getChildren(user.uid);

        console.log(
          "Children returned from Firestore:",
          data
        );

        setChildren(data);

        if (
          !selectedChild &&
          data.length > 0
        ) {
          const firstActive =
            data.find(
              (child) =>
                child.status === "active"
            ) ?? data[0];

          console.log(
            "Selecting child:",
            firstActive
          );

          setSelectedChild(firstActive);
        }
      } catch (error) {
        console.error(
          "Error loading children:",
          error
        );
      }

      console.log("==============================");
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
            console.log(
              "Selected:",
              child
            );

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