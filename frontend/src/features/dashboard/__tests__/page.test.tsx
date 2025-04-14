import { renderWithRedux } from "../../../utils/render-with-store";
import { initialCars } from "../../../data/initialCars";
import DashboardPage from "../page";

describe("Dashboard Page", () => {
  const initialState = {
    cars: {
      allCars: initialCars,
      selectedCarIdForRent: [],
      returnLocation: null,
    },
  };

  it("renders the dashboard page", () => {
    const { container } = renderWithRedux(<DashboardPage />, {
      preloadedState: initialState,
    });
    expect(container).toBeInTheDocument();
  });
});
