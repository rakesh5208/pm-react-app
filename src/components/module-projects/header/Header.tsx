import ProtectedElement from "@/components/common/ProtectedElement";

const Header = () => {
  return (
    <div className="p-4 flex">
      {/* left header actions */}
      <ul className="flex-1 flex gap-3">
        <li>
          <input type="text" placeholder="search"/>
        </li>
        <ProtectedElement permission="create:project" >
          <li>
            <button type="button">+New Project</button>
          </li>
        </ProtectedElement>
      </ul>

      {/* right header actions */}
      <ul className="flex gap-3">
        <ProtectedElement permission="create:project" >
          <li>
            <button type="button">Templates</button>
          </li>
        </ProtectedElement>
        <li>
          <button type="button">Filter</button>
        </li>
        <ProtectedElement permission="create:project" >
          <li>
            <button type="button">Export</button>
          </li>
        </ProtectedElement>
      </ul>
    </div>
  )
}

export default Header