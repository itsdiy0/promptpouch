import React from "react";
import { Button } from "@/components/ui/button"

const Register: React.FC = () => {
    return (
        <div>
        <h1>Register</h1>
        <form>
            <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" required />
            </div>
            <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
            </div>
            <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
            </div>
            <button type="submit">Register</button>
            <Button variant="outline">Button</Button>
        </form>
        </div>
    );
}

export default Register;