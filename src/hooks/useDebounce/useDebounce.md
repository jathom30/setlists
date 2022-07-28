# useDebounce

Debounces a value to prevent frequent rerenders.

---

## Ins and Outs

### Inputs

- `value: string | number`
- `delay: number` <- ms delay

### Returns

- `debouncedValue: string | number`

---

## Uses

useDebounce is most useful on inputs which may cause multiple renders onChange

Example:
```tsx
const [value, setValue] = useState('')
const debouncedValue = useDebounce(value, 200)

return (
  <>
    <input value={value} onChange={e => setValue(e.target.value)} />
    <Text on="white">{debouncedValue}</Text>
  </>
)
```