import SwiftUI
import SceneKit

// MARK: - App Entry Point
@main
struct HouseShoppingApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

// MARK: - Data Models & Mock Data
struct HousePlan: Identifiable, Hashable {
    let id = UUID()
    let name: String
    let price: String
    let details: String
    let imageName: String
    let modelName: String
}

struct MockData {
    static let plans = [
        HousePlan(name: "The Alpine Retreat", price: "$450,000", details: "3 Beds • 2 Baths • 2,100 sqft\nModern cabin aesthetic with large glass windows and an open-concept living area.", imageName: "photo.artframe", modelName: "house1"),
        HousePlan(name: "Suburban Bliss", price: "$520,000", details: "4 Beds • 3 Baths • 2,800 sqft\nA perfect family home featuring a spacious backyard, double garage, and a chef's kitchen.", imageName: "photo.artframe", modelName: "house2"),
        HousePlan(name: "Urban Minimalist", price: "$390,000", details: "2 Beds • 2 Baths • 1,600 sqft\nSleek, concrete-finish interior with smart-home integration built into every room.", imageName: "photo.artframe", modelName: "house3"),
        HousePlan(name: "Coastal Breeze", price: "$610,000", details: "5 Beds • 4 Baths • 3,200 sqft\nBeachfront inspired design with high vaulted ceilings, wrap-around porch, and sunroom.", imageName: "photo.artframe", modelName: "house4")
    ]
}

// MARK: - Liquid Glass View Modifier (Black & White)
struct Glassmorphism: ViewModifier {
    var cornerRadius: CGFloat
    
    func body(content: Content) -> some View {
        content
            .background(.ultraThinMaterial)
            .clipShape(RoundedRectangle(cornerRadius: cornerRadius, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .stroke(Color.white.opacity(0.2), lineWidth: 1)
            )
    }
}

extension View {
    func liquidGlass(cornerRadius: CGFloat = 20) -> some View {
        self.modifier(Glassmorphism(cornerRadius: cornerRadius))
    }
}

// MARK: - Main Content View (Bottom Tab Bar)
struct ContentView: View {
    var body: some View {
        TabView {
            ShoppingView()
                .tabItem {
                    Label("Shop", systemImage: "house")
                }
            
            OrdersView()
                .tabItem {
                    Label("Orders", systemImage: "hammer")
                }
            
            Text("Cart Details Placeholder")
                .font(.largeTitle)
                .tabItem {
                    Label("Cart", systemImage: "cart")
                }
            
            Text("Existing Houses Placeholder")
                .font(.largeTitle)
                .tabItem {
                    Label("Existing", systemImage: "map")
                }
        }
        // Force simple black and white theme
        .tint(.white)
       
    }
}

// MARK: - Shopping View (Grid of Cards)
struct ShoppingView: View {
    let columns = [GridItem(.adaptive(minimum: 280), spacing: 25)]
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading) {
                    Text("Select a Floor Plan")
                        .font(.system(.largeTitle, design: .rounded))
                        .fontWeight(.bold)
                        .padding(.horizontal)
                        .padding(.top, 20)
                        .foregroundColor(.white)
                    
                    LazyVGrid(columns: columns, spacing: 25) {
                        ForEach(MockData.plans) { plan in
                            NavigationLink(destination: HouseDetailView(plan: plan)) {
                                HouseCard(plan: plan)
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding()
                }
            }
            .background(Color.black.ignoresSafeArea())
        }
    }
}

// MARK: - House Card
struct HouseCard: View {
    let plan: HousePlan
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // 2D Image Placeholder
            ZStack {
                Color.white.opacity(0.05)
                Image(systemName: plan.imageName)
                    .font(.system(size: 40))
                    .foregroundColor(.white.opacity(0.3))
            }
            .frame(height: 180)
            .clipped()
            
            // Details
            VStack(alignment: .leading, spacing: 8) {
                Text(plan.name)
                    .font(.system(.title3, design: .rounded))
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                
                Text(plan.price)
                    .font(.headline)
                    .foregroundColor(.white) // Replaced green with white
                
                Text(plan.details)
                    .font(.subheadline)
                    .foregroundColor(.white.opacity(0.6))
                    .lineLimit(2)
            }
            .padding()
        }
        .liquidGlass(cornerRadius: 25)
    }
}

// MARK: - House Detail View (3D Model + Images)
struct HouseDetailView: View {
    let plan: HousePlan
    
    var body: some View {
        ScrollView {
            VStack(spacing: 25) {
                // 3D Scene View
                ZStack {
                    SceneView(scene: load3DScene(), options: [.allowsCameraControl, .autoenablesDefaultLighting])
                        .frame(height: 400)
                        .clipShape(RoundedRectangle(cornerRadius: 30, style: .continuous))
                    
                    // Instruction Tag
                    VStack {
                        Spacer()
                        HStack {
                            Image(systemName: "hand.draw.fill")
                            Text("Drag to rotate")
                        }
                        .font(.caption)
                        .foregroundColor(.white)
                        .padding(10)
                        .background(.ultraThinMaterial)
                        .clipShape(Capsule())
                        .padding(.bottom, 15)
                    }
                }
                .liquidGlass(cornerRadius: 30)
                .padding(.horizontal)
                
                // Bottom Image Previews
                VStack(alignment: .leading) {
                    Text("Gallery")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                        .padding(.horizontal)
                    
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 15) {
                            ForEach(0..<4) { _ in
                                RoundedRectangle(cornerRadius: 15)
                                    .fill(Color.white.opacity(0.05))
                                    .frame(width: 140, height: 100)
                                    .overlay(Image(systemName: "photo").foregroundColor(.white.opacity(0.3)))
                                    .liquidGlass(cornerRadius: 15)
                            }
                        }
                        .padding(.horizontal)
                    }
                }
                
                // Details Placeholder
                VStack(alignment: .leading, spacing: 15) {
                    Text("Plan Details")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                    
                    Text(plan.details)
                        .font(.body)
                        .foregroundColor(.white.opacity(0.7))
                        .lineSpacing(4)
                    
                    Button(action: {}) {
                        Text("Add to Orders - \(plan.price)")
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.white)
                            .foregroundColor(.black) // Strict black and white button
                            .clipShape(RoundedRectangle(cornerRadius: 15))
                    }
                    .padding(.top, 10)
                }
                .padding()
                .liquidGlass(cornerRadius: 25)
                .padding(.horizontal)
            }
            .padding(.vertical)
        }
        .background(Color.black.ignoresSafeArea())
        .navigationTitle(plan.name)
        .navigationBarTitleDisplayMode(.inline)
    }
    
    // Monochrome Fallback 3D scene
    func load3DScene() -> SCNScene {
        let scene = SCNScene()
        let box = SCNBox(width: 2, height: 2, length: 2, chamferRadius: 0.1)
        
        let material = SCNMaterial()
        material.diffuse.contents = UIColor.white // Replaced blue with white
        material.lightingModel = .physicallyBased
        box.materials = [material]
        
        let node = SCNNode(geometry: box)
        scene.rootNode.addChildNode(node)
        return scene
    }
}

// MARK: - Orders View (Progress Timeline)
struct OrdersView: View {
    let orderSteps = [
        ("Order Placed", "Dec 1st, 2023", true),
        ("Sourcing Blueprints", "Dec 3rd, 2023", true),
        ("Mixing Materials", "In Progress...", true),
        ("Getting Equipment Ready", "Pending", false),
        ("Foundation Laying", "Pending", false)
    ]
    
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            
            VStack(alignment: .leading) {
                Text("Active Orders")
                    .font(.system(.largeTitle, design: .rounded))
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                    .padding(.horizontal, 30)
                    .padding(.top, 20)
                
                VStack(alignment: .leading, spacing: 0) {
                    
                    HStack(alignment: .top) {
                        // Small preview image of the house
                        RoundedRectangle(cornerRadius: 15)
                            .fill(Color.white.opacity(0.05))
                            .frame(width: 80, height: 80)
                            .overlay(Image(systemName: "house.fill").foregroundColor(.white.opacity(0.3)))
                        
                        VStack(alignment: .leading, spacing: 5) {
                            Text("The Alpine Retreat")
                                .font(.title3).fontWeight(.bold)
                                .foregroundColor(.white)
                            Text("Order #849201")
                                .font(.subheadline).foregroundColor(.white.opacity(0.5))
                        }
                        .padding(.leading, 10)
                    }
                    .padding(.bottom, 30)
                    
                    // Timeline
                    ForEach(0..<orderSteps.count, id: \.self) { index in
                        OrderProgressRow(
                            title: orderSteps[index].0,
                            subtitle: orderSteps[index].1,
                            isCompleted: orderSteps[index].2,
                            isLast: index == orderSteps.count - 1
                        )
                    }
                }
                .padding(30)
                .liquidGlass(cornerRadius: 30)
                .padding(30)
                
                Spacer()
            }
        }
    }
}

struct OrderProgressRow: View {
    let title: String
    let subtitle: String
    let isCompleted: Bool
    let isLast: Bool
    
    var body: some View {
        HStack(alignment: .top, spacing: 20) {
            // Icon & Line (Strict Black & White)
            VStack(spacing: 0) {
                ZStack {
                    Circle()
                        .fill(isCompleted ? Color.white : Color.clear)
                        .stroke(Color.white.opacity(isCompleted ? 1.0 : 0.3), lineWidth: 2)
                        .frame(width: 24, height: 24)
                    
                    if isCompleted {
                        Image(systemName: "checkmark")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.black)
                    }
                }
                
                if !isLast {
                    Rectangle()
                        .fill(isCompleted ? Color.white : Color.white.opacity(0.2))
                        .frame(width: 2, height: 40)
                }
            }
            
            // Text
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.headline)
                    .foregroundColor(isCompleted ? .white : .white.opacity(0.4))
                Text(subtitle)
                    .font(.caption)
                    .foregroundColor(isCompleted ? .white.opacity(0.8) : .white.opacity(0.3))
            }
            .padding(.bottom, 20)
            
            Spacer()
        }
    }
}
