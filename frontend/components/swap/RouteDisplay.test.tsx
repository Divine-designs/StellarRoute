import { cleanup } from "@testing-library/react";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { RouteDisplay } from "./RouteDisplay";

describe("RouteDisplay", () => {
  beforeEach(() => {
    (
      window as Window & {
        __STELLAR_ROUTE_FLAGS__?: { routesBeta?: boolean };
      }
    ).__STELLAR_ROUTE_FLAGS__ = { routesBeta: true };
  });

  afterEach(() => {
    cleanup();
    delete (
      window as Window & {
        __STELLAR_ROUTE_FLAGS__?: unknown;
      }
    ).__STELLAR_ROUTE_FLAGS__;
    delete process.env.NEXT_PUBLIC_FEATURE_ROUTES_BETA;
  });

  it("does not render the experimental route panel when the flag is off", () => {
    (
      window as Window & {
        __STELLAR_ROUTE_FLAGS__?: { routesBeta?: boolean };
      }
    ).__STELLAR_ROUTE_FLAGS__ = { routesBeta: false };

    const { container } = render(<RouteDisplay amountOut="50.0" isLoading={false} />);

    expect(screen.queryByText("Best Route")).toBeNull();
    expect(container.firstChild).toBeNull();
  });

  it("should render loading skeleton when isLoading is true", () => {
    render(
      <RouteDisplay isLoading={true} route={[]} amountOut="0.0" />
    );

    // Check for skeleton elements (animate-pulse class)
    const skeletonElements = document.querySelectorAll(".animate-pulse");
    expect(skeletonElements.length).toBeGreaterThanOrEqual(1);
  });

  it("should render actual content when isLoading is false or undefined", () => {
    const mockRoute = ['XLM', 'USDC'];

    render(
      <RouteDisplay isLoading={false} route={mockRoute} amountOut="50.0" />
    );

    expect(screen.getByText(/optimal route/i)).toBeInTheDocument();
  });

  it("should accept isLoading prop as true", () => {
    const { container } = render(
      <RouteDisplay isLoading={true} route={[]} amountOut="0.0" />
    );

    // Verify skeleton is rendered by checking for skeleton elements
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should accept isLoading prop as false", () => {
    const { container } = render(
      <RouteDisplay isLoading={false} route={[]} amountOut="0.0" />
    );

    // Verify content is rendered (not skeleton)
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBe(0);
  });
});
