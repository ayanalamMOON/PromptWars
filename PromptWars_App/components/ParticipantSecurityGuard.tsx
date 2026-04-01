"use client";

import { useEffect } from "react";

export default function ParticipantSecurityGuard() {
    useEffect(() => {
        const previousUserSelect = document.body.style.userSelect;
        const previousWebkitUserSelect = document.body.style.webkitUserSelect;
        document.body.style.userSelect = "none";
        document.body.style.webkitUserSelect = "none";

        return () => {
            document.body.style.userSelect = previousUserSelect;
            document.body.style.webkitUserSelect = previousWebkitUserSelect;
        };
    }, []);

    return null;
}
