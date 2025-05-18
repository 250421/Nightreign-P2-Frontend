import { render, screen, fireEvent } from "@testing-library/react";
import { PlayerCard } from "@/features/battle/PlayerCards";

// Mocks
jest.mock("@/components/ui/card", () => ({
    Card: ({ children }: any) => <div data-testid="card">{children}</div>,
    CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
}));
jest.mock("@/components/ui/button", () => ({
    Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));
jest.mock("@/components/ui/carousel", () => ({
    Carousel: ({ children }: any) => <div data-testid="carousel">{children}</div>,
    CarouselContent: ({ children }: any) => <div data-testid="carousel-content">{children}</div>,
    CarouselItem: ({ children }: any) => <div data-testid="carousel-item">{children}</div>,
}));
jest.mock("lucide-react", () => ({
    Loader2: (props: any) => <div data-testid="loader" {...props} />,
}));
jest.mock("@/features/auth/hooks/use-auth", () => ({
    useAuth: () => ({ data: { username: "player1" } }),
}));

const basePlayer = {
    username: "player1",
    activeCharacters: [
        {
            character_id: 1,
            name: "Hero",
            characterImageUrl: "hero.png",
        },
        {
            character_id: 2,
            name: "Mage",
            characterImageUrl: "mage.png",
        },
    ],
    selectedCharacter: { character_id: 1, name: "Hero" },
    defeatedCharacters: [],
    battleReady: false,
};

describe("PlayerCard", () => {
    it("renders player username and character images", () => {
        render(
            <PlayerCard
                player={basePlayer as any}
                onSelect={jest.fn()}
                carouselRef={{ current: null }}
                onSimulate={jest.fn()}
                isSimulating={false}
                disabled={false}
            />
        );
        expect(screen.getByText("player1")).toBeInTheDocument();
        expect(screen.getAllByAltText(/Hero|Mage/)).toHaveLength(2);
    });

    it("renders character selection buttons and highlights selected", () => {
        render(
            <PlayerCard
                player={basePlayer as any}
                onSelect={jest.fn()}
                carouselRef={{ current: null }}
                onSimulate={jest.fn()}
                isSimulating={false}
                disabled={false}
            />
        );
        expect(screen.getByRole("button", { name: "Hero"})).toBeInTheDocument();
        expect(screen.getByText("Mage")).toBeInTheDocument();
        // Selected character button should have highlight class
        expect(screen.getByRole("button", { name: "Hero"}).className).toMatch(/border-blue-500/);
    });

    it("calls onSelect when character button is clicked", () => {
        const onSelect = jest.fn();
        render(
            <PlayerCard
                player={basePlayer as any}
                onSelect={onSelect}
                carouselRef={{ current: null }}
                onSimulate={jest.fn()}
                isSimulating={false}
                disabled={false}
            />
        );
        fireEvent.click(screen.getByText("Mage"));
        expect(onSelect).toHaveBeenCalledWith(1);
    });

    it("disables character button if defeated or not user's turn", () => {
        const player = {
            ...basePlayer,
            defeatedCharacters: [{ character_id: 2, name: "Mage" }],
        };
        render(
            <PlayerCard
                player={player as any}
                onSelect={jest.fn()}
                carouselRef={{ current: null }}
                onSimulate={jest.fn()}
                isSimulating={false}
                disabled={false}
            />
        );
        expect(screen.getByRole("button", { name: "Mage"})).toBeDisabled();
    });

    it("shows selected and defeated characters", () => {
        const player = {
            ...basePlayer,
            defeatedCharacters: [{ character_id: 2, name: "Mage" }],
        };
        render(
            <PlayerCard
                player={player as any}
                onSelect={jest.fn()}
                carouselRef={{ current: null }}
                onSimulate={jest.fn()}
                isSimulating={false}
                disabled={false}
            />
        );
        expect(screen.getByText("Selected Character:")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Hero"})).toBeInTheDocument();
        expect(screen.getByText("Defeated Characters:")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Mage"})).toBeInTheDocument();
    });

    it("shows loader when isSimulating is true", () => {
        render(
            <PlayerCard
                player={{ ...basePlayer, battleReady: false } as any}
                onSelect={jest.fn()}
                carouselRef={{ current: null }}
                onSimulate={jest.fn()}
                isSimulating={true}
                disabled={false}
            />
        );
        expect(screen.getByTestId("loader")).toBeInTheDocument();
    });

    it("shows 'Ready!' if battleReady is true", () => {
        render(
            <PlayerCard
                player={{ ...basePlayer, battleReady: true } as any}
                onSelect={jest.fn()}
                carouselRef={{ current: null }}
                onSimulate={jest.fn()}
                isSimulating={false}
                disabled={false}
            />
        );
        expect(screen.getByText("Ready!")).toBeInTheDocument();
    });

    it("shows 'Begin Battle!' if not ready and not simulating", () => {
        render(
            <PlayerCard
                player={{ ...basePlayer, battleReady: false } as any}
                onSelect={jest.fn()}
                carouselRef={{ current: null }}
                onSimulate={jest.fn()}
                isSimulating={false}
                disabled={false}
            />
        );
        expect(screen.getByText("Begin Battle!")).toBeInTheDocument();
    });

    it("calls onSimulate when simulate button is clicked", () => {
        const onSimulate = jest.fn();
        render(
            <PlayerCard
                player={{ ...basePlayer, battleReady: false } as any}
                onSelect={jest.fn()}
                carouselRef={{ current: null }}
                onSimulate={onSimulate}
                isSimulating={false}
                disabled={false}
            />
        );
        fireEvent.click(screen.getByText("Begin Battle!"));
        expect(onSimulate).toHaveBeenCalled();
    });

    it("disables simulate button if disabled prop is true", () => {
        render(
            <PlayerCard
                player={{ ...basePlayer, battleReady: false } as any}
                onSelect={jest.fn()}
                carouselRef={{ current: null }}
                onSimulate={jest.fn()}
                isSimulating={false}
                disabled={true}
            />
        );
        expect(screen.getByText("Begin Battle!")).toBeDisabled();
    });
});