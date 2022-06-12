const users = []


 
export const addUser = ({id, name, room}) => {
  if (!name || !room) return { error: 'Name and room is required' };
  const existingUser = users.find(user => user.room === room && user.name === name);
  if (existingUser) return { error: 'User already exists' }
  
  const user = { id, name, room }
  users.push(user)

  return {user}
}

export const removeUser = (id: string) => {
  if (!id) return { error: 'id is required' };

  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

export const getUserByRoom = (room: string) => {

  const user = users.filter(user => user.room === room);
  return user
  
}