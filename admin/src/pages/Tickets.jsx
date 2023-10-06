import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getMyTickets, reset } from '../features/tickets/ticketSlice'
import Spinner from '../components/Spinner'
import BackButton from '../components/BackButton'
import TicketItem from '../components/TicketItem'

const Tickets = () => {
  const { tickets, isLoading, isSuccess } = useSelector(state => state.tickets)
  const { user } = useSelector(state => state.auth)

  const dispatch = useDispatch()

  useEffect(() => {
    return () => {
      if (isSuccess) {
        dispatch(reset())
      }
    }
  }, [dispatch, isSuccess])

  useEffect(() => {
    dispatch(getMyTickets(user._id))
  }, [dispatch])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <BackButton url='/' />
      <h1>My Tickets</h1>
      <div className='tickets'>
        <div className='ticket-headings'>
          <div>Student Number</div>
          <div>Department</div>
          <div>Course</div>
          <div>Name</div>
          <div>Date</div>
          <div>Category</div>
          <div>Status</div>
          <div>View</div>
        </div>
        
        {
          tickets.length === 0 ?
          <p>There's no ticket here</p> :
          tickets.map(ticket => (
            <TicketItem key={ticket._id} ticket={ticket} />
          ))
        }
      </div>
    </>
  )
}

export default Tickets
