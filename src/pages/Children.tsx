import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import ChildForm, {
  type ChildFormData,
} from "../components/children/ChildForm";

import ChildCard from "../components/children/ChildCard";

import { useAuth } from "../contexts/AuthContext";

import type { Child } from "../types/child";

import {
  createChild,
  getChildren,
  updateChild,
  archiveChild,
  restoreChild,
  deleteChild,
} from "../services/childService";

export default function Children() {
  const { user } = useAuth();

  const [children, setChildren] = useState<Child[]>([]);

  const [loading, setLoading] = useState(true);

  const [editingChild, setEditingChild] =
    useState<Child | null>(null);

  async function loadChildren() {
    if (!user) return;

    setLoading(true);

    try {
      const data = await getChildren(user.uid);

      setChildren(data);
    } catch (error) {
      console.error(error);

      alert("Unable to load children.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadChildren();
  }, [user]);

  async function handleSubmit(
    child: ChildFormData
  ) {
    if (!user) return;

    try {
      if (editingChild) {
        await updateChild(
          user.uid,
          editingChild.id,
          child
        );

        alert("Child updated successfully.");
      } else {
        await createChild(user.uid, child);

        alert("Child added successfully.");
      }

      setEditingChild(null);

      await loadChildren();
    } catch (error) {
      console.error(error);

      alert("Unable to save child.");
    }
  }

  async function handleArchive(id: string) {
    if (!user) return;

    if (
      !window.confirm(
        "Archive this child?"
      )
    )
      return;

    await archiveChild(user.uid, id);

    await loadChildren();
  }

  async function handleRestore(id: string) {
    if (!user) return;

    await restoreChild(user.uid, id);

    await loadChildren();
  }

  async function handleDelete(id: string) {
    if (!user) return;

    if (
      !window.confirm(
        "Delete this child?\n\nThis cannot be undone."
      )
    )
      return;

    try {
      await deleteChild(user.uid, id);

      await loadChildren();
    } catch (error) {
      console.error(error);

      alert("Unable to delete child.");
    }
  }

  return (
    <DashboardLayout>

      <div className="space-y-8">

        {/* Header */}

        <div>

          <h1 className="text-4xl font-bold">
            Children
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your children and their funding.
          </p>

        </div>

        {/* Form */}

        <ChildForm
          onSubmit={handleSubmit}
          editingChild={editingChild}
          onCancelEdit={() =>
            setEditingChild(null)
          }
        />

        {/* List */}

        <section>

          <div className="mb-6 flex items-center justify-between">

            <h2 className="text-2xl font-bold">
              Your Children
            </h2>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              {children.length} Child
              {children.length !== 1
                ? "ren"
                : ""}
            </span>

          </div>

          {loading ? (

            <div className="rounded-xl bg-white p-8 shadow">
              Loading...
            </div>

          ) : children.length === 0 ? (

            <div className="rounded-xl bg-white p-10 text-center shadow">

              <h3 className="text-xl font-semibold">
                No Children Added
              </h3>

              <p className="mt-2 text-gray-500">
                Add your first child to begin
                tracking funding.
              </p>

            </div>

          ) : (

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {children.map((child) => (

                <ChildCard
                  key={child.id}
                  child={child}
                  onEdit={setEditingChild}
                  onArchive={handleArchive}
                  onRestore={handleRestore}
                  onDelete={handleDelete}
                />

              ))}

            </div>

          )}

        </section>

      </div>

    </DashboardLayout>
  );
}