import { useState } from "react";

const SideBarLogic = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return { mobileOpen, handleDrawerToggle };
}

export default SideBarLogic;