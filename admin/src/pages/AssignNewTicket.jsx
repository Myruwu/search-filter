import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTickets, reset } from '../features/tickets/ticketSlice';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';
import TicketItem from '../components/TicketItem';

const AssignNewTickets = () => {
  const { tickets, isLoading, isSuccess } = useSelector(state => state.tickets);
  const dispatch = useDispatch();

  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [availableCourses, setAvailableCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    return () => {
      if (isSuccess) {
        dispatch(reset());
      }
    }
  }, [dispatch, isSuccess]);

  useEffect(() => {
    dispatch(getTickets());
  }, [dispatch]);

  useEffect(() => {
    // Update available courses based on the selected department
    if (filterDepartment === 'CITE') {
      setAvailableCourses(['BSIT']);
    } else if (filterDepartment === 'CEA') {
      setAvailableCourses(['BSCPE', 'BSCE', 'BSEE']);
    } else {
      setAvailableCourses([]); // Reset available courses if no department is selected
    }
  }, [filterDepartment]);

  // Filter tickets based on selected department, course, and search term
  const filteredTickets = tickets.filter(ticket => {
    const isDepartmentMatch =
      filterDepartment === '' || ticket.department.toLowerCase() === filterDepartment.toLowerCase();

    const isCourseMatch =
      filterCourse === '' || availableCourses.includes(filterCourse);

    const isSearchMatch =
      searchTerm === '' ||
      Object.values(ticket).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

    return isDepartmentMatch && isCourseMatch && isSearchMatch;
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <BackButton url='/' />
      <h1>Assign New Tickets</h1>

      {/* Filter Input Fields */}
      <div className='search-and-filter'>
        <input
          type='text'
          placeholder='Search'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          value={filterDepartment}
          onChange={e => setFilterDepartment(e.target.value)}
        >
          <option value=''>Filter by Department</option>
          <option value='CITE'>CITE</option>
          <option value='CEA'>CEA</option>
          {/* Add more department options if needed */}
        </select>
        <select
          value={filterCourse}
          onChange={e => setFilterCourse(e.target.value)}
        >
          <option value=''>Filter by Course</option>
          {availableCourses.map(course => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>

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

        {filteredTickets.length === 0 ? (
          <p>No matching tickets found</p>
        ) : (
          filteredTickets.map(ticket => (
            <TicketItem key={ticket._id} ticket={ticket} />
          ))
        )}
      </div>
    </>
  );
};

export default AssignNewTickets;
