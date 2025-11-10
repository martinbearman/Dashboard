import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ModuleActionsMenu } from "@/components/modules/ModuleActionsMenu";
import { updateModuleConfig, removeModuleConfig } from "@/lib/store/slices/moduleConfigsSlice";
import { removeModule } from "@/lib/store/slices/dashboardsSlice";

const mockDispatch = vi.fn();
let mockActiveDashboardId: string | null = "board-1";

vi.mock("@/lib/store/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({
      dashboards: { activeDashboardId: mockActiveDashboardId },
    }),
}));

describe("ModuleActionsMenu", () => {
  const moduleId = "module-123";

  beforeEach(() => {
    mockDispatch.mockClear();
    mockActiveDashboardId = "board-1";
  });

  it("toggles the menu open and closed via the trigger button", async () => {
    const user = userEvent.setup();
    render(<ModuleActionsMenu moduleId={moduleId} locked={false} />);

    const trigger = screen.getByRole("button", { name: /open module menu/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu")).toBeNull();

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.click(trigger);
    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("invokes the configure placeholder and closes the menu", async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => undefined);

    render(<ModuleActionsMenu moduleId={moduleId} locked={false} />);
    await user.click(screen.getByRole("button", { name: /open module menu/i }));

    await user.click(screen.getByRole("menuitem", { name: /configure/i }));

    expect(alertSpy).toHaveBeenCalledWith("Module configuration coming soon.");
    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeNull();
    });
    alertSpy.mockRestore();
  });

  it("dispatches an update when toggling the lock state", async () => {
    const user = userEvent.setup();
    render(<ModuleActionsMenu moduleId={moduleId} locked={false} />);

    await user.click(screen.getByRole("button", { name: /open module menu/i }));
    await user.click(screen.getByRole("menuitem", { name: /lock/i }));

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(
      updateModuleConfig({
        moduleId,
        config: { locked: true },
      }),
    );
    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeNull();
    });
  });

  it("removes the module and its config when requested", async () => {
    const user = userEvent.setup();
    render(<ModuleActionsMenu moduleId={moduleId} locked={false} />);

    await user.click(screen.getByRole("button", { name: /open module menu/i }));
    await user.click(screen.getByRole("menuitem", { name: /remove/i }));

    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith(
      removeModule({ dashboardId: "board-1", moduleId }),
    );
    expect(mockDispatch).toHaveBeenCalledWith(removeModuleConfig(moduleId));
    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeNull();
    });
  });

  it("disables removal actions when the module is locked", async () => {
    const user = userEvent.setup();
    render(<ModuleActionsMenu moduleId={moduleId} locked />);

    await user.click(screen.getByRole("button", { name: /open module menu/i }));

    const removeButton = screen.getByRole("menuitem", { name: /remove/i });
    expect(removeButton).toBeDisabled();
    expect(removeButton).toHaveAttribute("aria-disabled", "true");

    await user.click(removeButton);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("logs a warning and skips dispatch when no dashboard is active", async () => {
    mockActiveDashboardId = null;
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const user = userEvent.setup();

    render(<ModuleActionsMenu moduleId={moduleId} locked={false} />);

    await user.click(screen.getByRole("button", { name: /open module menu/i }));
    await user.click(screen.getByRole("menuitem", { name: /remove/i }));

    expect(warnSpy).toHaveBeenCalledWith(
      "Attempted to remove a module, but no dashboard is active.",
    );
    expect(mockDispatch).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});


