import ProtectedElement from "@/components/common/ProtectedElement";
import Button from "@/components/common/Button";
const Header = () => {
  return (
    <div className="py-4 flex">
      {/* left header actions */}
      <ul className="flex-1 flex gap-3">
        <li>
          <input type="text" placeholder="search"/>
        </li>
        <ProtectedElement permission="create:project" >
          <li>
            <Button type="button">+New Project</Button>
          </li>
        </ProtectedElement>
      </ul>

      {/* right header actions */}
      <ul className="flex gap-3">
        <ProtectedElement permission="create:project" >
          <li>
            <Button type="button">Templates</Button>
          </li>
        </ProtectedElement>
        <li>
          <Button type="button">Filter</Button>
        </li>
        <ProtectedElement permission="create:project" >
          <li>
            <Button type="button">Export</Button>
          </li>
        </ProtectedElement>
      </ul>
    </div>
  )
}

export default Header