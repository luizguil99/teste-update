import { useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Checkbox } from './components/ui/checkbox'
import { toast } from '@/hooks/use-toast'
import { Toaster } from './components/ui/toaster'

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = async (e) => {
    e.preventDefault()
    if (!input.trim()) {
      toast({
        title: 'Empty Task',
        description: 'Please enter a task before adding',
        variant: 'destructive'
      })
      return
    }

    setIsAdding(true)
    await new Promise(resolve => setTimeout(resolve, 200))
    
    setTodos([...todos, {
      id: Date.now(),
      text: input.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }])
    setInput('')
    setIsAdding(false)
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
    toast({
      title: 'Task Removed',
      description: 'Todo item has been deleted',
    })
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  return (
    <div className="max-w-md mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4 animate-fade-in-down">Todo List</h1>
      
      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task"
          className="transition-all duration-300 focus:ring-2 focus:ring-primary"
        />
        <Button 
          type="submit" 
          disabled={isAdding}
          className="relative overflow-hidden"
        >
          {isAdding ? (
            <span className="animate-pulse">Adding...</span>
          ) : 'Add'}
        </Button>
      </form>

      <div className="flex gap-2 mb-4 animate-fade-in">
        {['all', 'active', 'completed'].map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            onClick={() => setFilter(f)}
            className="capitalize transition-colors duration-200"
          >
            {f}
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground animate-fade-in">
            No tasks found. Start by adding a new one!
          </div>
        ) : filteredTodos.map(todo => (
          <div 
            key={todo.id}
            className="flex items-center gap-2 p-2 border rounded 
              transition-all duration-300 hover:bg-accent/10
              animate-in slide-in-from-right-8 fade-in-0"
          >
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => toggleTodo(todo.id)}
              className="h-5 w-5 rounded-md transition-transform 
                hover:scale-110 duration-200"
            />
            <span className={`flex-1 ${todo.completed ? 
              'line-through text-gray-400' : ''} transition-colors duration-200`}>
              {todo.text}
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteTodo(todo.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity
                duration-300"
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
      <Toaster />
    </div>
  )
}

export default App
