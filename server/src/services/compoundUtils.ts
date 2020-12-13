import { inspect } from 'util'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js'
import {
  ICompoundRegistration,
  IItem,
  IPayment
} from '../dao/CompoundRegistrationsDAO'

dayjs.extend(isSameOrAfter)

function getAllRegistrations(compound: ICompoundRegistration) {
  const { persons, unmatchedRegistrations } = compound

  const registrations = [
    ...(persons?.flatMap(p => p.registrations) || []),
    ...(unmatchedRegistrations || [])
  ]

  if (!registrations.length)
    throw new Error(
      `the compound ${inspect(compound, {
        depth: Infinity
      })} does not contain any registrations`
    )
  return registrations
}

// assuming that all registrations with lodgings have truthy room
function getAllRoomStays(
  compound: ICompoundRegistration,
  validStatusOnly = true
) {
  return getAllRegistrations(compound)
    .filter(reg => !(validStatusOnly && reg.status.match(/cancelled/)))
    .filter(reg => reg.room)
}

function getAllItems(compound: ICompoundRegistration) {
  return getAllRegistrations(compound).flatMap(reg => reg.items)
}

function getAllPayments(compound: ICompoundRegistration) {
  return getAllRegistrations(compound).flatMap(reg => reg.payments)
}

const isStatusComplete = (t: IPayment | IItem) => t.status === 'complete'

// returns item total with an optional filter function
// (including all credits transactions)
function getItemTotal(
  compound: ICompoundRegistration,
  filter: (item: IItem) => boolean = () => true
) {
  return +getAllItems(compound)
    .filter(isStatusComplete)
    .filter(filter)
    .reduce(
      (aggregate, item) =>
        aggregate -
        item.credit_amount +
        item.charge_amount +
        // discount_amount only matters when charge_amount is not 0.
        (item.charge_amount ? item.discount_amount : 0),
      0
    )
    .toFixed(2)
}

function getRealItemTotal(compound: ICompoundRegistration) {
  return getItemTotal(
    compound,
    (item: IItem) =>
      !item.category.match(
        /^applied-personal-credit|transfer-to-personal-credit$/
      )
  )
}

function getTaxTotal(compound: ICompoundRegistration) {
  return +getAllItems(compound)
    .filter(isStatusComplete)
    .reduce(
      (aggregate, item) => aggregate + item.tax_1_amount + item.tax_2_amount,
      0
    )
    .toFixed(2)
}

// total amount of payments only (regardless of credits used)
function getPaymentTotal(compound: ICompoundRegistration) {
  return +getAllPayments(compound)
    .filter(isStatusComplete)
    .reduce(
      (aggregate, payment) =>
        aggregate - payment.charge_amount + payment.credit_amount,
      0
    )
    .toFixed(2)
}

// total amount taken from personal credit
function getRealCreditPayments(compound: ICompoundRegistration) {
  return +(getRealItemTotal(compound) - getItemTotal(compound)).toFixed(2)
}

// total amount of payments and credits used from personal credit
// this should match the "RealItemTotal" and "taxTotal" to have 0 balance.
function getRealPaymentTotal(compound: ICompoundRegistration) {
  return +(getPaymentTotal(compound) + getRealCreditPayments(compound)).toFixed(
    2
  )
}

function getTotalBalance(compound: ICompoundRegistration) {
  return +(
    getRealItemTotal(compound) +
    getTaxTotal(compound) -
    getRealPaymentTotal(compound)
  ).toFixed(2)
}

// function calculateCost(
//   compound: ICompoundRegistration,
//   allLodgings,
//   allPrograms
// ) {
//   // get all lodging registrations
//   const allStays = getAllRoomStays(compound)

//   // see if program overwrites price, or get the price from the lodgings
//   const programs = allPrograms
//     .filter(program =>
//       allStays.map(s => s.program_id).some(p => p === program.id)
//     )
//     .map(p => p.pricing_options)

//   // console.log(inspect(programs, { depth: Infinity, colors: true }))

//   return allStays
//     .map(stay => {
//       const lodging = allLodgings.find(
//         lodging => stay.lodging_id === lodging.id
//       )
//       console.log(
//         'lodging',
//         inspect(lodging, { depth: Infinity, colors: true })
//       )
//       debugger
//       const [currentSeason] = lodging.price.seasons.filter(
//         season =>
//           dayjs(stay.start_date).isSameOrAfter(season.startDate) &&
//           dayjs(stay.end_date).isBefore(season.endDate)
//       )
//       const nightlyPrice = currentSeason
//         ? currentSeason.nightlyPrice
//         : lodging.price.nightlyPrice

//       console.log(
//         'nightly price',
//         inspect(nightlyPrice, { depth: Infinity, colors: true })
//       )

//       const nights = dayjs(stay.end_date).diff(dayjs(stay.start_date), 'day')
//       console.log('nights', nights)

//       // multiply by number of nights
//       return nights * nightlyPrice
//     })
//     .reduce((agg, stayCost) => agg + stayCost, 0)
// }

export {
  getAllRegistrations,
  getAllRoomStays,
  getAllItems,
  getAllPayments,
  getItemTotal,
  getTaxTotal,
  getPaymentTotal,
  getRealItemTotal,
  getRealPaymentTotal,
  getRealCreditPayments,
  getTotalBalance
  //   calculateCost
}
