# Modal Component

The popover component allows you to attach a variable size popover on any component

---


### Props

- `children?: ReactElement`
- `content?: ReactNode`
- `position?: 'top' | 'right' | 'bottom' | 'left'[]`
- `align?: 'start' | 'center' | 'end'`
- `isOpen?: Boolean`

---

## Uses

The goal of this component is to be able to make a reusable and user friendly popover component to be used freely. 

## Notes

Children must be wrapped in a <div> tag. This is because of the use of HTMLDivElement, this could be potentially changed in the future but for now this is a requirement for the popover to work properly.

```tsx
      <Popover
        align="end"
        position={positionPriorityOne}
        content={<Avatar name="David" />}
        isOpen={isPopoverOneOpen}
      >
        <div>
          <Button
            UNSAFE_className="RandomBox"
            onClick={() => setIsPopoverOneOpen(!isPopoverOneOpen)}
          >
            This is a button
          </Button>
        </div>
      </Popover>
```