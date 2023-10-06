import { Link } from 'react-router-dom'
import { useDispatch , useSelector} from 'react-redux'
import { assignTicket } from '../features/tickets/ticketSlice'

const TicketItem = ({ ticket }) => {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  
  const handleAssigned = async () => {
    const userId = user._id;
    const ticketId = ticket._id;
    dispatch(assignTicket(userId, ticketId))
  }

  return (
    <div className='ticket'>
      <div>{ticket.studentNumber}</div>
      <div>{ticket.department}</div>
      <div>{ticket.course}</div>
      <div>{ticket.name}</div>
      <div>{new Date(ticket.createdAt).toLocaleString('tr-TR')}</div>
      <div>{ticket.product}</div>
      <div className={`status status-${ticket.status}`}>{ticket.status}</div>
      <div className='btn-container'>
      <Link to={`/ticket/${ticket._id}`} className='btn btn-sm'>
        View
      </Link>
      <button onClick={handleAssigned}className='btn btn-sm'>
        {
          ticket.admin ? "Unassigned" : "Assigned" 
        }
      </button>
      </div>
    </div>
  )
}

export default TicketItem
