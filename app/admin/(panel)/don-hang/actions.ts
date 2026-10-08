"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { audit, requireAdmin } from "@/lib/auth";
import { OrderError, updateAdminNote, updateOrderStatus } from "@/lib/orders";

const statusSchema = z.object({
  id: z.coerce.number().int().positive(),
  status: z.enum(["confirmed", "shipping", "completed", "cancelled"]),
  note: z.string().trim().max(300).default(""),
});

export async function changeStatusAction(_: unknown, fd: FormData): Promise<{ error?: string; ok?: boolean }> {
  const admin = await requireAdmin(); // luôn xác thực lại trong mỗi action
  const parsed = statusSchema.safeParse({ id: fd.get("id"), status: fd.get("status"), note: fd.get("note") ?? "" });
  if (!parsed.success) return { error: "Dữ liệu không hợp lệ." };
  try {
    updateOrderStatus(parsed.data.id, parsed.data.status, parsed.data.note, admin.username);
  } catch (e) {
    if (e instanceof OrderError) return { error: e.message };
    throw e;
  }
  audit(admin.id, "order_status", `#${parsed.data.id} → ${parsed.data.status}`);
  revalidatePath(`/admin/don-hang/${parsed.data.id}`);
  return { ok: true };
}

export async function saveNoteAction(fd: FormData) {
  const admin = await requireAdmin();
  const id = z.coerce.number().int().positive().parse(fd.get("id"));
  const note = z.string().trim().max(1000).parse(fd.get("admin_note") ?? "");
  updateAdminNote(id, note);
  audit(admin.id, "order_note", `#${id}`);
  revalidatePath(`/admin/don-hang/${id}`);
}
