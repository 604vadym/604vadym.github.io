import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { fetchData } from "../utils/api";
import { type User } from "../types/interfaces";
import UserFetcher from "./UserFetcher";

vi.mock("../utils/api", () => ({
  fetchData: vi.fn(),
}));

const mockedFetchData = vi.mocked(fetchData);

const mockUser: User = {
  id: 6,
  name: "Clementine Bauch",
  username: "Samantha",
  email: "samantha@example.com",
  address: {
    street: "Douglas Extension",
    suite: "Suite 847",
    city: "McKenziehaven",
    zipcode: "59590-4157",
    geo: {
      lat: "-68.6102",
      lng: "-47.0653",
    },
  },
  phone: "1-770-736-8031",
  website: "ramiro.info",
  company: {
    name: "Romaguera-Jacobson",
    catchPhrase: "Face to face bifurcated interface",
    bs: "e-enable strategic applications",
  },
};

describe("UserFetcher", () => {
  it("displays loading state while fetching user data", () => {
    mockedFetchData.mockReturnValue(
      new Promise<User>(() => {}) as ReturnType<typeof fetchData>,
    );

    render(<UserFetcher />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays user data after successful fetching", async () => {
    mockedFetchData.mockReturnValue(
      Promise.resolve(mockUser) as ReturnType<typeof fetchData>,
    );

    render(<UserFetcher />);

    expect(
      await screen.findByText(`Username: ${mockUser.username}`),
    ).toBeInTheDocument();

    expect(
      screen.getByText(`City: ${mockUser.address.city}`),
    ).toBeInTheDocument();

    expect(screen.getByText(`Email: ${mockUser.email}`)).toBeInTheDocument();
  });

  it("displays error message when fetching fails", async () => {
    const errorMessage = "Failed to fetch data";

    mockedFetchData.mockRejectedValue(new Error(errorMessage));

    render(<UserFetcher />);

    expect(
      await screen.findByText(`Error loading user: ${errorMessage}`),
    ).toBeInTheDocument();
  });
});
