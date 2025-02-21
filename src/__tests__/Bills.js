/**
 * @jest-environment jsdom
 */

import {
    screen,
    waitFor,
    waitForDomChange,
    waitForElement,
} from "@testing-library/dom"
import { toHaveAttribute } from "@testing-library/jest-dom/matchers"

import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills.js"
import { ROUTES } from "../constants/routes.js"
import mockStore from "../__mocks__/store"
import { ROUTES_PATH } from "../constants/routes.js"
import { localStorageMock } from "../__mocks__/localStorage.js"

import router from "../app/Router.js"

expect.extend({ toHaveAttribute })
jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
        test("Then bill icon in vertical layout should be highlighted", async () => {
            Object.defineProperty(window, "localStorage", {
                value: localStorageMock,
            })
            window.localStorage.setItem(
                "user",
                JSON.stringify({
                    type: "Employee",
                })
            )
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.Bills)
            await waitFor(() => screen.getByTestId("icon-window"))
            const windowIcon = screen.getByTestId("icon-window")
            expect(windowIcon.classList).toContain("active-icon")
        })
        test("Then bills should be ordered from earliest to latest", () => {
            document.body.innerHTML = BillsUI({ data: bills })
            const dates = screen
                .getAllByText(
                    /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
                )
                .map((a) => a.innerHTML)
            const antiChrono = (a, b) => (a < b ? 1 : -1)
            const datesSorted = [...dates].sort(antiChrono)
            expect(dates).toEqual(datesSorted)
        })
        test("Then fetches bills from mock API GET", async () => {
            const spyList = jest.spyOn(mockStore.bills(), "list")
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.Bills)

            expect(spyList).toHaveBeenCalled()
            const billImageName = screen.getByText("Hôtel et logement")
            expect(billImageName).toBeTruthy()
        })
    })
    describe("When I am on Bills Page and click New Bill", () => {
        test("Then I should be redirected to New Bill Page", async () => {
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.Bills)
            const buttonNewBill = screen.getByTestId("btn-new-bill")
            buttonNewBill.click()
            const pageTitle = screen.getByText("Envoyer une note de frais")
            expect(pageTitle).toBeTruthy()
        })
    })
    describe("When I am on Bills Page and click on Icon eye", () => {
        test("Then I should see the modal with the corresponding image", async () => {
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)

            router()
            window.onNavigate(ROUTES_PATH.Bills)

            $.fn.modal = jest.fn()

            const billIconEye = screen.getAllByTestId("icon-eye")[0]
            billIconEye.click()

            const billImage = screen.getByAltText("Bill")
            expect(billImage.getAttribute("src")).toBe(
                "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a"
            )
        })
    })
})
