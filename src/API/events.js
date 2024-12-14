import axios from "axios"
import dayjs from "dayjs"

const EVENTS_API_URL = "http://localhost:5001/events" // TODO: 5000

export const getAllEvents = async (user) => {
  try {
    const res = await axios.get(
      `${EVENTS_API_URL}/${user._id}`,
      { headers: { Authorization: `Bearer ${user.token}` }}
    );
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error('Failed to fetch events');
      console.log("Failed to fetch events")
    }
  } catch (error) {
    console.error('Failed to fetch events:', error.res ? error.res.data.message : error.message);
    return [];
  }
};

export const getEventsByRepId = async (user, rep_id) => {
  try {
    const res = await axios.get(
      `${EVENTS_API_URL}/repeated/${rep_id}`,
      { headers: { Authorization: `Bearer ${user.token}` }}
    );
    if (res.status === 200 && res.data.length > 0) {
      return res.data;
    } else {
      throw new Error('Failed to fetch events by rep_id');
      console.log("Failed to fetch events by rep_id")
    }
  } catch (error) {
    console.error('Failed to fetch events by rep_id:', error.res ? error.res.data.message : error.message);
    return [];
  }
};

//export const createEvent = async(event, user) => {
//  try {
//    var res = null;
//    if (event.repeated) {
//      if (event.repeatedData.type === "endsOn") {
//        var repeated_events = [];
//        const last_date = dayjs(event.repeatedData.endsOn).add(dayjs(event.begin).hour(), "hour").add(dayjs(event.begin).minute(), "minute");
//        console.log("last_date: ", last_date.format("DD-MM-YYYY HH:mm"))
//        const initial_date_begin = dayjs(event.begin);
//        console.log("initial date begin: ", initial_date_begin.format("DD-MM-YYYY HH:mm"))
//        const initial_date_end = dayjs(event.end);
//        let i = 0;
//        var current_date_begin = initial_date_begin
//        var current_date_end = initial_date_end
//        while(current_date_begin.isBefore(last_date)) {
//          current_date_begin = initial_date_begin.add(i, event.repeatedData.every);
//          console.log(i+":", current_date_begin.format("DD-MM-YYYY HH:mm"))
//          current_date_end = initial_date_end.add(i, event.repeatedData.every);
//          const rep_event = {
//            ...event,
//            begin: current_date_begin.valueOf(),
//            end: current_date_end.valueOf()
//          }
//          res = await axios.post(
//            `${EVENTS_API_URL}/${user._id}`,
//            { ...rep_event },
//            { headers: { Authorization: `Bearer ${user.token}` }}
//          );
//          if (res.status === 201) {
//            repeated_events.push(res.data);
//          }
//          else throw new Error("Failed to create event");
//          i++;
//        }
//        console.log(repeated_events)
//        return repeated_events
//      } else if (event.repeatedData.type === "endsAfter") {
//        var repeated_events = [];
//        const initial_rep_num = event.repeatedData.endsAfter;
//        for (let i = 1; i <= initial_rep_num; i++) {
//          const begin = dayjs(event.begin).add(i-1, event.repeatedData.every)
//          const end = dayjs(event.end).add(i-1, event.repeatedData.every)
//          const rep_event = {
//            ...event,
//            begin: begin.valueOf(),
//            end: end.valueOf(),
//            repeatedData: {
//              ...event.repeatedData,
//              endsAfter: initial_rep_num-i+1
//            }
//          }
//          //console.log("creating event that ends after "+i+" occurrences", rep_event)
//          res = await axios.post(
//            `${EVENTS_API_URL}/${user._id}`,
//            { ...rep_event },
//            { headers: { Authorization: `Bearer ${user.token}` }}
//          );
//          if (res.status === 201) repeated_events.push(res.data);
//          else throw new Error("Failed to create event");
//        }
//        return repeated_events;
//      }
//    } else {
//      const res = await axios.post(
//        `${EVENTS_API_URL}/${user._id}`,
//        { ...event },
//        { headers: { Authorization: `Bearer ${user.token}` }}
//      );
//      if (res.status === 201) return [res.data];
//      else throw new Error("Failed to create event");
//    }
//  } catch (error) {
//    console.error(error.message);
//    return null;
//  }
//}

export const createSingleEvent = async (event, user) => {
  try {
    const res = await axios.post(
      `${EVENTS_API_URL}/${user._id}`,
      { ...event },
      { headers: { Authorization: `Bearer ${user.token}` }}
    );
    if (res.status === 201) return res.data;
    else throw new Error("Failed to create event");
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

export const createRepeatedEvent = async (event, user) => {
  try {
    if (event.repeatedData.type === "endsOn") {
      var repeated_events = [];
      const last_date = dayjs(event.repeatedData.endsOn).add(dayjs(event.begin).hour(), "hour").add(dayjs(event.begin).minute(), "minute");
      console.log("last_date: ", last_date.format("DD-MM-YYYY HH:mm"))
      const initial_date_begin = dayjs(event.begin);
      console.log("initial date begin: ", initial_date_begin.format("DD-MM-YYYY HH:mm"))
      const initial_date_end = dayjs(event.end);
      let i = 0;
      var current_date_begin = initial_date_begin
      var current_date_end = initial_date_end
      while(current_date_begin.isBefore(last_date)) {
        current_date_begin = initial_date_begin.add(i, event.repeatedData.every);
        console.log(i+":", current_date_begin.format("DD-MM-YYYY HH:mm"))
        current_date_end = initial_date_end.add(i, event.repeatedData.every);
        const rep_event = {
          ...event,
          begin: current_date_begin.valueOf(),
          end: current_date_end.valueOf()
        }
        const res = await axios.post(
          `${EVENTS_API_URL}/${user._id}`,
          { ...rep_event },
          { headers: { Authorization: `Bearer ${user.token}` }}
        );
        if (res.status === 201) {
          repeated_events.push(res.data);
        }
        else throw new Error("Failed to create event");
        i++;
      }
      console.log(repeated_events)
      return repeated_events
    }
    else if (event.repeatedData.type === "endsAfter") {
      var repeated_events = [];
      const initial_rep_num = event.repeatedData.endsAfter;
      for (let i = 1; i <= initial_rep_num; i++) {
        const begin = dayjs(event.begin).add(i-1, event.repeatedData.every)
        const end = dayjs(event.end).add(i-1, event.repeatedData.every)
        const rep_event = {
          ...event,
          begin: begin.valueOf(),
          end: end.valueOf(),
          repeatedData: {
            ...event.repeatedData,
            endsAfter: initial_rep_num-i+1
          }
        }
        //console.log("creating event that ends after "+i+" occurrences", rep_event)
        const res = await axios.post(
          `${EVENTS_API_URL}/${user._id}`,
          { ...rep_event },
          { headers: { Authorization: `Bearer ${user.token}` }}
        );
        if (res.status === 201) repeated_events.push(res.data);
        else throw new Error("Failed to create event");
      }
      return repeated_events;
    }
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

export const modifyEvent = async (event_to_modify, user, modifyRepeated) => {
  try {
    if (!modifyRepeated) {
      const res = await axios.patch(
        `${EVENTS_API_URL}/${event_to_modify._id}`,
        { event_to_modify },
        { headers: { Authorization: `Bearer ${user.token}` }}
      );
      if (res.status === 200) return res.data;
      else throw new Error("Could not modify event")
    } else {
      var all_events_to_modify = await getEventsByRepId(user, event_to_modify.repeatedData.rep_id)
      var modified_events = [];
      for (let e of all_events_to_modify) {
        const begin = dayjs(event_to_modify.begin);
        const end = dayjs(event_to_modify.end);
        const mod_begin = dayjs(e.begin).startOf("day").add(begin.hour(), "h").add(begin.minute(), "m").valueOf()
        const mod_end = dayjs(e.end).startOf("day").add(end.hour(), "h").add(end.minute(), "m").valueOf()
        e = {
          ...event_to_modify,
          _id: e._id,
          repeatedData: e.repeatedData,
          begin: mod_begin,
          end: mod_end
        }
        const res = await axios.patch(
          `${EVENTS_API_URL}/${e._id}`,
          { event_to_modify: e },
          { headers: { Authorization: `Bearer ${user.token}` }}
        );
        if (res.status === 200) modified_events.push(e);
        else throw new Error("Could not modify event")
      }
      return modified_events;
    }
  } catch (error) {
    console.error(error.message);
    return modifyRepeated ? [] : null;
  }
}

export const deleteEvents = async (events, user) => {
  try {
    for (let event of events) {
      const res = await axios.delete(
        `${EVENTS_API_URL}/${event._id}`,
        { headers: { Authorization: `Bearer ${user.token}` }}
      );
      if (res.status !== 200) throw new Error("Could not delete event", event._id);
    }
    return true;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}
