"use client";

import {
    Paragraph,
    Button,
} from "@khenzii-dev/ui/atoms";
import { signOut } from "next-auth/react";

const Admin = () => {
    return (
        <>
            <Paragraph fontSize={1.5}>{"You're logged in!"}</Paragraph>
            <Button 
                onClick={() => signOut({ redirect: false })}
                style={{ width: "fit-content" }}
            >
                <Paragraph>Logout</Paragraph>
            </Button>
        </>
    );
};

export default Admin;
