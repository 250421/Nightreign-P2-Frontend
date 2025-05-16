import { render, screen } from "@testing-library/react";
import { UserProfile } from "@/components/shared/navbar/user-profile";
import "@testing-library/jest-dom";

describe("UserProfile", () => {
    it("should say 1 == 1", () => {
        expect(1).toBe(1);
    })

    it("should render", () => {
        render(<UserProfile/>);
        expect(screen.findByText("")).toBeInTheDocument();
    })
})