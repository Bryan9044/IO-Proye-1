import type { TreeNode } from '../types'

type Props = {
  root: TreeNode | null
}

type PositionedNode = {
  node: TreeNode
  id: number
  depth: number
  order: number
  left: PositionedNode | null
  right: PositionedNode | null
}

type Point = {
  id: number
  label: string
  x: number
  y: number
}

type Edge = {
  from: Point
  to: Point
}

const nodeWidth = 120
const nodeHeight = 44
const horizontalGap = 160
const verticalGap = 110
const padding = 50

function countNodes(node: TreeNode | null): number {
  if (!node) return 0
  return 1 + countNodes(node.left) + countNodes(node.right)
}

function maxDepth(node: TreeNode | null): number {
  if (!node) return 0
  return 1 + Math.max(maxDepth(node.left), maxDepth(node.right))
}

function positionTree(root: TreeNode): PositionedNode {
  let nextOrder = 0
  let nextId = 0

  const visit = (node: TreeNode, depth: number): PositionedNode => {
    const left = node.left ? visit(node.left, depth + 1) : null
    const order = nextOrder++
    const id = nextId++
    const right = node.right ? visit(node.right, depth + 1) : null
    return { node, id, depth, order, left, right }
  }

  return visit(root, 0)
}

export default function TreeView({ root }: Props) {
  if (!root) {
    return <p className="my-4 text-slate-600">No hay árbol para mostrar.</p>
  }

  const positionedRoot = positionTree(root)
  const points = new Map<number, Point>()
  const edges: Edge[] = []
  const totalNodes = countNodes(root)
  const contentWidth = padding * 2 + nodeWidth + (totalNodes - 1) * horizontalGap
  const width = Math.max(360, contentWidth)
  const horizontalOffset = (width - contentWidth) / 2 + padding + nodeWidth / 2
  const height = padding * 2 + (maxDepth(root) - 1) * verticalGap + nodeHeight

  const collect = (item: PositionedNode) => {
    const point: Point = {
      id: item.id,
      label: item.node.key,
      x: horizontalOffset + item.order * horizontalGap,
      y: padding + item.depth * verticalGap,
    }
    points.set(item.id, point)

    for (const child of [item.left, item.right]) {
      if (child) {
        const childPoint: Point = {
          id: child.id,
          label: child.node.key,
          x: horizontalOffset + child.order * horizontalGap,
          y: padding + child.depth * verticalGap,
        }
        edges.push({ from: point, to: childPoint })
        collect(child)
      }
    }
  }

  collect(positionedRoot)

  return (
    <section className="my-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="mb-3 text-left text-lg font-semibold text-slate-800 dark:text-slate-100">
        Árbol óptimo de búsqueda
      </h2>
      <div className="overflow-x-auto">
        <svg
          role="img"
          aria-label="Visualización del árbol óptimo de búsqueda"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="mx-auto block"
        >
          {edges.map(({ from, to }) => (
            <line
              key={`${from.id}-${to.id}`}
              x1={from.x}
              y1={from.y + nodeHeight / 2}
              x2={to.x}
              y2={to.y - nodeHeight / 2}
              stroke="#64748b"
              strokeWidth="2"
            />
          ))}
          {Array.from(points.values()).map((point) => (
            <g key={point.id}>
              <rect
                x={point.x - nodeWidth / 2}
                y={point.y - nodeHeight / 2}
                width={nodeWidth}
                height={nodeHeight}
                rx="12"
                fill="#ede9fe"
                stroke="#7c3aed"
                strokeWidth="2"
              />
              <text
                x={point.x}
                y={point.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#1e1b4b"
                fontSize="14"
                fontWeight="600"
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  )
}
