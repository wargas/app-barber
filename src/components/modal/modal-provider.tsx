import { createContext, useEffect, useState } from "react";
import { EventManager } from "@/lib/events";
import type { ModalItemProps } from "@/components/modal/modal-types"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";

export const ModalContext = createContext(
  {} as Omit<ModalItemProps, "element">
);

type Props = { children: any } & Omit<ModalItemProps, "element">;
export function ModalProvider({ children, options, id }: Props) {
  const [show, setShow] = useState(false);

  function close() {
    removeModal()
    EventManager.emit(`close-modal`, id, null);
  }

  useEffect(() => {
    setShow(true);

    EventManager.on(`close-modal:${id}`, function () {
      setShow(false);
    });

    return () => {
      EventManager.off(`show-modal:${id}`);
      EventManager.off(`hide-modal:${id}`);
    };
  }, [id]);

  function removeModal(): void {
    EventManager.emit("remove-modal", id);
  }

  return (
    <ModalContext.Provider value={{ options, id }}>
      <Drawer direction="right" open={show} onOpenChange={ev => !ev ? close() : null}>
        <DrawerContent>
          <DrawerHeader className="border-b">
            <DrawerTitle>
              {options.title}
            </DrawerTitle>
          </DrawerHeader>

          {children}
        </DrawerContent>
      </Drawer>
    </ModalContext.Provider>
  );
}